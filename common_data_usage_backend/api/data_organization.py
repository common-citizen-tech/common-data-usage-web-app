import networkx as nx
from duckdb import DuckDBPyConnection
from fastapi import APIRouter, Depends
import polars as pl
from starlette.responses import JSONResponse

from common_data_usage_backend.db import get_db
from common_data_usage_backend.graphs.data_organization_datasets import get_data_organization_datasets_graph_injected
from common_data_usage_backend.graphs.graph_utils import JSONGraphResponse, is_graph_too_large_to_render, GEXFResponse

data_organization_router = APIRouter()


@data_organization_router.get("/")
def data_organizations_route(
        db: DuckDBPyConnection = Depends(get_db),
):
    data_organizations_df: pl.DataFrame = db.sql(
        "SELECT id, title, image_url as imageUrl FROM final_clean_organizations"
    ).pl()
    return {
        'organizations': data_organizations_df.to_dicts()
    }


@data_organization_router.get("/{org_id}")
def data_organization_route(org_id: str, db: DuckDBPyConnection = Depends(get_db)):
    data_organization_df: pl.DataFrame = db.execute(
        "SELECT id, title, image_url as imageUrl FROM final_clean_organizations WHERE id = ?", (org_id,)
    ).pl()
    datasets_count = db.execute("""
            SELECT COUNT(*) FROM final_clean_datasets WHERE owner_org = ?
        """, (org_id,)).fetchone()[0]

    resources_count = db.execute("""
        SELECT COUNT(*) FROM final_clean_all_resources WHERE organization_id = ?
        """, (org_id,)).fetchone()[0]

    resources_with_pathless_url_count = db.execute("""
            SELECT 
            COUNT(*) 
            FROM final_clean_all_resources
             WHERE (
                organization_id = ? AND
                (
                url LIKE 'http://%/[^/]'
                OR url LIKE 'https://%/[^/]'
                )
            )
            """, (org_id,)).fetchone()[0]

    resources_without_https_count = db.execute("""
                SELECT 
                COUNT(*) 
                FROM final_clean_all_resources
                 WHERE (
                    organization_id = ? AND
                    (url NOT LIKE 'http://%' AND url NOT LIKE 'https://%')
                )
                """, (org_id,)).fetchone()[0]

    resources_with_duplicated_urls_count = db.execute("""
                SELECT COUNT(*)
                FROM final_clean_all_resources
                WHERE url IN (
                    SELECT url
                    FROM final_clean_all_resources
                    WHERE organization_id = $1
                    GROUP BY url
                    HAVING COUNT(*) > 1
                ) AND organization_id = $1""", (org_id,)).fetchone()[0]

    top_formats_df = db.execute("""
        SELECT format, COUNT(*) AS count FROM final_clean_all_resources WHERE organization_id = ?
         GROUP BY format ORDER BY count DESC LIMIT 10
    """, (org_id,)).pl()

    connected_repos_count = db.execute("""
        SELECT COUNT(distinct repository) FROM final_resource_repository_mappings WHERE organization_id = ?
    """, (org_id,)).fetchone()[0]

    resources_used_count = db.execute("""
            SELECT COUNT(distinct resource_id) FROM final_resource_repository_mappings WHERE organization_id = ?
        """, (org_id,)).fetchone()[0]

    top_repo_owners_df: pl.DataFrame = db.execute("""
            SELECT 
                regexp_extract(repository, '^([^\/]+\/[^\/]+)', 1) as repository_owner,
                COUNT(DISTINCT repository) as repo_count
            FROM 
                final_resource_repository_mappings 
            WHERE organization_id = ?
            GROUP BY regexp_extract(repository, '^([^\/]+\/[^\/]+)', 1)
            ORDER BY repo_count DESC
            LIMIT 10;
    """, (org_id,)).pl()

    return {
        'organization': data_organization_df.row(0, named=True),
        'resources_count': resources_count,
        'resources_without_http_count': resources_without_https_count,
        'resources_with_pathless_url_count': resources_with_pathless_url_count,
        'resources_with_duplicated_urls_count': resources_with_duplicated_urls_count,
        'resources_used_count': resources_used_count,
        'datasets_count': datasets_count,
        'connected_repos_count': connected_repos_count,
        'top_formats': top_formats_df.to_dicts(),
        'top_repo_owners': top_repo_owners_df.to_dicts()
    }


@data_organization_router.get("/{org_id}/graphs/data-organization-datasets")
def data_organization_route(
        graph: nx.Graph = Depends(get_data_organization_datasets_graph_injected)
):
    return JSONGraphResponse(graph)


@data_organization_router.get("/{org_id}/graphs/data-organization-datasets/is-safe")
def data_organization_graph_is_safe_route(
        graph: nx.Graph = Depends(get_data_organization_datasets_graph_injected)
):
    return JSONResponse({
        'is_graph_safe_to_render': not is_graph_too_large_to_render(graph)
    })


@data_organization_router.get("/{org_id}/graphs/data-organization-datasets/gexf")
def data_organization_route(
        graph: nx.Graph = Depends(get_data_organization_datasets_graph_injected)
):
    return GEXFResponse(graph)
