from fastapi import APIRouter

from common_data_usage_backend.api.data_organization import data_organization_router
from common_data_usage_backend.api.dataset import dataset_router
from common_data_usage_backend.api.repository import repository_router
from common_data_usage_backend.api.search import search_router

router = APIRouter()

api_routers = {
    '/data-organization': data_organization_router,
    '/dataset': dataset_router,
    '/repository': repository_router,
    '/search': search_router
}

for prefix, api_router in api_routers.items():
    router.include_router(api_router, prefix=prefix)


@router.get("/health")
def health():
    return {"status": "ok"}
