from functools import lru_cache

import networkx as nx
from cachetools import cached, LRUCache
from cachetools.keys import hashkey
from duckdb import DuckDBPyConnection
import polars as pl
from fastapi import Depends

from common_data_usage_backend.db import get_db
from common_data_usage_backend.utils.repository_id import deserialize_repository_id


def create_repository_datasets_organizations_graph(
        db: DuckDBPyConnection,
        repository_id: str
) -> nx.Graph:
    datasets_df: pl.DataFrame = db.execute(
        """
       SELECT
            final_resource_repository_mappings.dataset_id,
            final_resource_repository_mappings.repository,
            datasets.title,
        FROM
            final_resource_repository_mappings
        JOIN
            final_clean_datasets AS datasets
        ON
            final_resource_repository_mappings.dataset_id = datasets.id
        WHERE
            final_resource_repository_mappings.repository = ?
        """, (repository_id,)
    ).pl()
    data_organizations_df: pl.DataFrame = db.execute(
        """
       SELECT
            final_resource_repository_mappings.organization_id,
            final_resource_repository_mappings.dataset_id,
            final_resource_repository_mappings.repository,
            organizations.title,
        FROM
            final_resource_repository_mappings
        JOIN
            final_clean_organizations AS organizations
        ON
            final_resource_repository_mappings.organization_id = organizations.id
        WHERE
            final_resource_repository_mappings.repository = ?
        """, (repository_id,)
    ).pl()

    graph = nx.Graph()
    graph.add_node(
        repository_id,
        label=f"Repository: {repository_id}",
        entityType="repository"
    )

    for dataset in datasets_df.iter_rows(named=True):
        dataset_id = dataset["dataset_id"]
        if not graph.has_node(dataset_id):
            graph.add_node(dataset_id, label=f"Dataset: {dataset_id}", entityType="dataset")
        graph.add_edge(dataset_id, dataset["repository"])

    for organization in data_organizations_df.iter_rows(named=True):
        organization_id = organization["organization_id"]
        if not graph.has_node(organization_id):
            graph.add_node(organization_id, label=f"Organization: {organization_id}", entityType="dataOrganization")
        graph.add_edge(organization_id, organization["dataset_id"])
    return graph


# @cached(cache=LRUCache(maxsize=100), key=lambda dataset_id, db: hashkey(dataset_id))
def get_repository_datasets_organizations_graph_injected(
        repository_id: str,
        db: DuckDBPyConnection = Depends(get_db),
):
    return create_repository_datasets_organizations_graph(db, repository_id)
