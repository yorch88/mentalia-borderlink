from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

_client: AsyncIOMotorClient | None = None


def get_mongo_client() -> AsyncIOMotorClient:
    global _client

    if _client is None:
        _client = AsyncIOMotorClient(settings.MONGO_URI)

    return _client


def get_global_db():
    client = get_mongo_client()
    return client[settings.GLOBAL_DB_NAME]


def get_tenant_db(db_name: str):
    client = get_mongo_client()
    return client[db_name]
