from fastapi import FastAPI

from common_data_usage_backend.router import router
from common_data_usage_backend.sentry import init_sentry

init_sentry()

app = FastAPI()

app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Go to /api"}
