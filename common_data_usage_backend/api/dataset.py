from duckdb import DuckDBPyConnection
from fastapi import APIRouter, Depends
import polars as pl
import networkx as nx
from starlette.responses import Response, JSONResponse

from common_data_usage_backend.db import get_db
from common_data_usage_backend.graphs.data_organization_datasets import create_data_organization_datasets_graph, \
    get_data_organization_datasets_graph_injected
from common_data_usage_backend.graphs.dataset_resources_repos import get_dataset_resources_repos_graph_injected
from common_data_usage_backend.graphs.graph_utils import JSONGraphResponse, GEXFResponse, is_graph_too_large_to_render

dataset_router = APIRouter()


@dataset_router.get("/")
def datasets_route(
        db=Depends(get_db),
        org_id: str | None = None
):
    stmt = "SELECT id, title FROM final_clean_datasets"
    parameters = ()
    if org_id:
        stmt = "SELECT id, title FROM final_clean_datasets WHERE owner_org = ?"
        parameters = (org_id,)

    result_df = db.execute(stmt, parameters).pl()
    return JSONResponse({
        'datasets': result_df.to_dicts()
    })


@dataset_router.get("/{dataset_id}")
def datasets_route(
        dataset_id: str,
        db=Depends(get_db),
):
    dataset_df = db.execute("""
        SELECT
            final_clean_datasets.id,
            final_clean_datasets.title,
            final_clean_organizations.title as orgName,
            final_clean_organizations.id as orgId
        FROM
            final_clean_datasets
        JOIN
            final_clean_organizations
        ON
            final_clean_datasets.owner_org = final_clean_organizations.id
        WHERE
            final_clean_datasets.id = ?
    """, (dataset_id,)).pl()

    resources_df = db.execute("""
        SELECT id, name, url FROM final_clean_all_resources WHERE package_id = ?
    """, (dataset_id,)).pl()

    connected_repos_count = db.execute("""
            SELECT COUNT(distinct repository) FROM final_resource_repository_mappings WHERE dataset_id = ?
        """, (dataset_id,)).fetchone()[0]

    return JSONResponse({
        'dataset': dataset_df.row(0, named=True),
        'resources': resources_df.to_dicts(),
        'resources_count': resources_df.shape[0],
        'connected_repos_count': connected_repos_count
    })


@dataset_router.get("/{dataset_id}/graphs/dataset-resources-repos")
def data_organization_route(
        graph: nx.Graph = Depends(get_dataset_resources_repos_graph_injected)
):
    return JSONGraphResponse(graph)

@dataset_router.get("/{dataset_id}/graphs/dataset-resources-repos/is-safe")
def dataset_graph_is_safe_route(
        graph: nx.Graph = Depends(get_dataset_resources_repos_graph_injected)
):
    return JSONResponse({
        'is_graph_safe_to_render': not is_graph_too_large_to_render(graph)
    })


@dataset_router.get("/{dataset_id}/graphs/dataset-resources-repos/gexf")
def dataset_graph_gexf_route(
        graph: nx.Graph = Depends(get_dataset_resources_repos_graph_injected)
):
    return GEXFResponse(graph)
