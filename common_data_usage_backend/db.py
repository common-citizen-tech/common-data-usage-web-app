from typing import Generator

from duckdb import duckdb

from common_data_usage_backend.settings import settings


def get_db() -> Generator[duckdb.DuckDBPyConnection, None, None]:
    db = duckdb.connect(settings.final_database_file, read_only=True)
    try:
        yield db
    finally:
        db.close()
