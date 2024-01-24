import sentry_sdk
from common_data_usage_backend.settings import settings


def init_sentry():
    if settings.backend_sentry_dsn:
        sentry_sdk.init(
            dsn=settings.backend_sentry_dsn,
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
        )
