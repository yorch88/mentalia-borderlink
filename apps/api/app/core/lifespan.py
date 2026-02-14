from contextlib import asynccontextmanager
from app.db.mongo import get_mongo_client
from app.core.config import settings


@asynccontextmanager
async def lifespan(app):

    # Validación básica en producción
    if settings.is_production:
        if settings.DEBUG:
            raise RuntimeError("DEBUG cannot be enabled in production")

    client = get_mongo_client()
    db = client[settings.GLOBAL_DB_NAME]
    tenants = db["tenants"]

    # Índices críticos
    await tenants.create_index("email", unique=True)
    await tenants.create_index("client_code", unique=True)
    await tenants.create_index("approval_jti", unique=True, sparse=True)

    yield

    client.close()
