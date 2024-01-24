FROM python:3.11

ARG WORKDIR=/opt/app

ENV PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  POETRY_VERSION=1.7.1 \
  PYTHONPATH=$WORKDIR

# System deps:
RUN pip install "poetry==$POETRY_VERSION"

# Copy only requirements to cache them in docker layer
WORKDIR $WORKDIR

RUN export PYTHONPATH=/opt/app
COPY poetry.lock pyproject.toml ./

# Project initialization:
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi --no-root

COPY common_data_usage_backend ./common_data_usage_backend

CMD ["uvicorn", "common_data_usage_backend.main:app", "--host", "0.0.0.0", "--port", "8000"]