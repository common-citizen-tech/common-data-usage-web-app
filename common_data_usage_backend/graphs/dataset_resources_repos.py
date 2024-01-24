from functools import lru_cache

import networkx as nx
from cachetools import cached, LRUCache
from cachetools.keys import hashkey
from duckdb import DuckDBPyConnection
import polars as pl
from fastapi import Depends

from common_data_usage_backend.db import get_db


def create_datasets_resources_repos_graph(
        db: DuckDBPyConnection,
        dataset_id: str
) -> nx.Graph:
    dataset = db.execute(
        "SELECT id, title FROM final_clean_datasets WHERE id = ?", (dataset_id,)
    ).pl().row(0, named=True)

    resources_df: pl.DataFrame = db.execute(
        """
        SELECT 
            id,
            name
        FROM final_clean_all_resources WHERE package_id = ?
        """, (dataset_id,)
    ).pl()

    repos_df: pl.DataFrame = db.execute(
        """
         SELECT 
                repository, resource_id
        FROM final_resource_repository_mappings
        WHERE dataset_id = ?
        """,
        (dataset_id,)
    ).pl()
    # related_datasets_df: pl.DataFrame = db.execute(
    #     """
    #    SELECT
    #         final_resource_repository_mappings.dataset_id,
    #         final_resource_repository_mappings.repository,
    #         datasets.title,
    #     FROM
    #         final_resource_repository_mappings
    #     JOIN
    #         final_clean_datasets AS datasets
    #     ON
    #         final_resource_repository_mappings.dataset_id = datasets.id
    #     WHERE
    #         final_resource_repository_mappings.repository IN (
    #             SELECT DISTINCT
    #                 repository
    #             FROM
    #                 final_resource_repository_mappings
    #             WHERE
    #                 dataset_id = ?
    #         );
    #     """, (dataset_id,)
    # ).pl()
    graph = nx.Graph()
    graph.add_node(
        dataset_id,
        label=f"Dataset: {dataset['title']}",
        entityType="dataset"
    )
    for resource in resources_df.iter_rows(named=True):
        graph.add_node(resource["id"], label=f"Resource: {resource['name']}", entityType="resource")
        graph.add_edge(resource["id"], dataset_id)

    for repo in repos_df.iter_rows(named=True):
        repo_id = repo["repository"]
        if not graph.has_node(repo_id):
            graph.add_node(repo_id, label=f"Repository: {repo_id}", entityType="repository")

        graph.add_edge(repo_id, repo["resource_id"])

    return graph


def get_dataset_resources_repos_graph_injected(
        dataset_id: str,
        db: DuckDBPyConnection = Depends(get_db),
):
    return create_datasets_resources_repos_graph(db, dataset_id)
