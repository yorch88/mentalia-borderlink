from contextlib import asynccontextmanager
import time

from app.db.mongo import get_mongo_client
from app.core.config import settings
from app.security.hashing import hash_password


@asynccontextmanager
async def lifespan(app):

    # =========================
    # Validación Producción
    # =========================
    if settings.is_production:
        if settings.DEBUG:
            raise RuntimeError("DEBUG cannot be enabled in production")

    client = get_mongo_client()
    db = client[settings.GLOBAL_DB_NAME]

    tenants = db["tenants"]
    admin_users = db["admin_users"]

    # =========================
    # Índices críticos TENANTS
    # =========================
    await tenants.create_index("email", unique=True)
    await tenants.create_index("client_code", unique=True)
    await tenants.create_index("approval_jti", unique=True, sparse=True)

    # =========================
    # Índices críticos ADMIN USERS
    # =========================
    await admin_users.create_index("email", unique=True)
    await admin_users.create_index("approval_jti", unique=True, sparse=True)

    # =========================
    # Bootstrap Super Admin
    # =========================
    existing_super_admin = await admin_users.find_one({
        "role": "super_admin",
        "status": "active"
    })

    if not existing_super_admin:
        if settings.BOOTSTRAP_ADMIN_EMAIL and settings.BOOTSTRAP_ADMIN_PASSWORD:
            await admin_users.insert_one({
                "email": settings.BOOTSTRAP_ADMIN_EMAIL,
                "password_hash": hash_password(settings.BOOTSTRAP_ADMIN_PASSWORD),
                "role": "super_admin",
                "status": "active",
                "created_at": int(time.time())
            })
            print("✅ Super admin bootstrap creado")
        else:
            print("⚠ No bootstrap admin configured")

    yield

    client.close()
