from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='../.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )

    final_database_file: str
    backend_sentry_dsn: str | None = None

    def model_post_init(self, __context) -> None:
        model_dump_items = self.model_dump().items()
        non_empty_keys = [
            key for key, value in model_dump_items if value
        ]
        print(f"Initialized with settings: {', '.join(non_empty_keys)}")


settings = Settings()
