from functools import lru_cache

import networkx as nx
from cachetools import cached, LRUCache
from cachetools.keys import hashkey
from duckdb import DuckDBPyConnection
import polars as pl
from fastapi import Depends

from common_data_usage_backend.db import get_db


def create_data_organization_datasets_graph(
        db: DuckDBPyConnection,
        org_id: str
) -> nx.Graph:
    data_organization = db.execute(
        "SELECT id, title, image_url as imageUrl FROM final_clean_organizations WHERE id = ?", (org_id,)
    ).pl().row(0, named=True)
    datasets_df: pl.DataFrame = db.execute(
        """
        SELECT id, title FROM final_clean_datasets WHERE owner_org = ?
        """,
        (org_id,)
    ).pl()
    repositories_df: pl.DataFrame = db.execute(
        """
        SELECT repository, resource_id, dataset_id FROM final_resource_repository_mappings WHERE organization_id = ?
        """,
        (org_id,)
    ).pl()
    graph = nx.Graph()
    graph.add_node(org_id, label=f"Organization: {data_organization['title']}", entityType="dataOrganization")
    for dataset in datasets_df.iter_rows(named=True):
        graph.add_node(dataset["id"], label=f"Dataset: {dataset['title']}", entityType="dataset")
        graph.add_edge(dataset["id"], org_id)
    for repository in repositories_df.iter_rows(named=True):
        repo_id = repository["repository"]
        if not graph.has_node(repo_id):
            graph.add_node(repo_id, label=f"Repository: {repo_id}", entityType="repository")
        graph.add_edge(repo_id, repository["dataset_id"])
    return graph


@cached(cache=LRUCache(maxsize=100), key=lambda org_id, db: hashkey(org_id))
def get_data_organization_datasets_graph_injected(
        org_id: str,
        db: DuckDBPyConnection = Depends(get_db),
):
    return create_data_organization_datasets_graph(db, org_id)
