from urllib.parse import unquote


def serialize_repository_id(repository_id: str):
    return repository_id.replace("/", "__")


def deserialize_repository_id(serialized_repository_id: str):
    return unquote(serialized_repository_id)
