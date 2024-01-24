import networkx as nx
from duckdb import DuckDBPyConnection
from fastapi import APIRouter, Depends
import polars as pl
from starlette.responses import JSONResponse

from common_data_usage_backend.db import get_db
from common_data_usage_backend.graphs.repository_datasets_organizations import \
    get_repository_datasets_organizations_graph_injected, create_repository_datasets_organizations_graph
from common_data_usage_backend.graphs.graph_utils import JSONGraphResponse, is_graph_too_large_to_render, GEXFResponse
from common_data_usage_backend.utils.repository_id import deserialize_repository_id


def get_repository_route(repository_id: str, db: DuckDBPyConnection):
    print(repository_id)
    repository_df: pl.DataFrame = db.execute(
        """
        SELECT repository, repoStars, repoLastFetched FROM final_sourcegraph_search_results WHERE repository = ? LIMIT 1
        """, (repository_id,)
    ).pl()
    datasets_count = db.execute("""
            SELECT COUNT(distinct dataset_id) FROM final_resource_repository_mappings WHERE repository = ?
        """, (repository_id,)).fetchone()[0]

    resources_count = db.execute("""
        SELECT COUNT(distinct resource_id) FROM final_resource_repository_mappings WHERE repository = ?
        """, (repository_id,)).fetchone()[0]

    top_formats_df = db.execute("""
        SELECT 
            format, COUNT(*) AS count
        FROM final_clean_all_resources WHERE id IN (
            SELECT distinct resource_id FROM final_resource_repository_mappings WHERE repository = ?
        )
        GROUP BY format ORDER BY count DESC LIMIT 10
    """, (repository_id,)).pl()

    top_organizations_df: pl.DataFrame = db.execute("""
            SELECT 
                organizations.id as organization_id,
                ANY_VALUE(organizations.title) as organization_title,
                COUNT(DISTINCT dataset_id) as datasets_count
            FROM 
                final_resource_repository_mappings
            JOIN final_clean_organizations organizations
            ON organizations.id = final_resource_repository_mappings.organization_id
            WHERE repository = ?
            GROUP BY organizations.id
            ORDER BY datasets_count DESC
            LIMIT 10;
    """, (repository_id,)).pl()

    return {
        'repository': repository_df.row(0, named=True),
        'resources_count': resources_count,
        'datasets_count': datasets_count,
        'top_formats': top_formats_df.to_dicts(),
        'top_organizations': top_organizations_df.to_dicts()
    }


def get_repo_graph_route(
        graph: nx.Graph
):
    return JSONGraphResponse(graph)


def get_is_repo_graph_safe_route(graph: nx.Graph):
    return JSONResponse({
        'is_graph_safe_to_render': not is_graph_too_large_to_render(graph)
    })


def repo_graph_gexf_route(
        graph: nx.Graph
):
    return GEXFResponse(graph)


route_suffixes = {
    '/graphs/repository-datasets-organizations': get_repo_graph_route,
    '/graphs/repository-datasets-organizations/is-safe': get_is_repo_graph_safe_route,
    '/graphs/repository-datasets-organizations/gexf': repo_graph_gexf_route
}

repository_router = APIRouter()


@repository_router.get("/{repository_id:path}")
def repository_wildcard_route(repository_id: str, db: DuckDBPyConnection = Depends(get_db)):
    for suffix, route_fn in route_suffixes.items():
        if repository_id.endswith(suffix) or repository_id.endswith(suffix + '/'):
            repo_id = repository_id[:-len(suffix)]
            graph = create_repository_datasets_organizations_graph(db, repo_id)
            return route_fn(graph)

    return get_repository_route(repository_id, db)
