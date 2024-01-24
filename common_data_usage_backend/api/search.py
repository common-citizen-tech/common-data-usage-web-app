from fastapi import APIRouter, Depends, Query
from pydantic import Field
from starlette.responses import JSONResponse

from common_data_usage_backend.db import get_db

search_router = APIRouter()


@search_router.get("/")
def search_all_route(
        query: str = Query(..., title="Search query", min_length=3),
        limit: int = Query(5, title="Limit of results to return"),
        db=Depends(get_db),
):
    print(query)
    datasets_count = db.execute(
        "SELECT COUNT(*) FROM final_clean_datasets WHERE title ILIKE $1",
        (f"%{query}%",)
    ).fetchone()[0]
    datasets_df = db.execute(
        "SELECT id, title FROM final_clean_datasets WHERE title ILIKE $1 LIMIT $2",
        (f"%{query}%", limit)
    ).pl()

    organizations_count = db.execute(
        "SELECT COUNT(*) FROM final_clean_organizations WHERE title ILIKE $1",
        (f"%{query}%",)
    ).fetchone()[0]
    organizations_df = db.execute(
        "SELECT id, title FROM final_clean_organizations WHERE title ILIKE $1 LIMIT $2",
        (f"%{query}%", limit)
    ).pl()

    repositories_count = db.execute(
        "SELECT COUNT(distinct repository) FROM final_sourcegraph_search_results WHERE repository ILIKE $1",
        (f"%{query}%",)
    ).fetchone()[0]
    repositories_df = db.execute(
        "SELECT distinct repository FROM final_sourcegraph_search_results WHERE repository ILIKE $1 LIMIT $2",
        (f"%{query}%", limit)
    ).pl()

    return JSONResponse({
        'datasets': {
            'count': datasets_count,
            'results': datasets_df.to_dicts()
        },
        'dataOrganizations': {
            'count': organizations_count,
            'results': organizations_df.to_dicts()
        },
        'repositories': {
            'count': repositories_count,
            'results': repositories_df.to_dicts()
        }
    })
