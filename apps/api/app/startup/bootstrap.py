import time
from app.db.mongo import get_global_db
from app.security.hashing import hash_password
from app.core.config import settings
from datetime import datetime, timezone

async def bootstrap_super_admin():

    db = get_global_db()
    col = db["admin_users"]

    existing = await col.find_one({
        "role": "super_admin",
        "status": "active"
    })

    if existing:
        return

    if not settings.BOOTSTRAP_ADMIN_EMAIL or not settings.BOOTSTRAP_ADMIN_PASSWORD:
        print("⚠ BOOTSTRAP admin not configured")
        return

    await col.insert_one({
        "email": settings.BOOTSTRAP_ADMIN_EMAIL,
        "password_hash": hash_password(settings.BOOTSTRAP_ADMIN_PASSWORD),
        "role": "super_admin",
        "status": "active",
        "created_at": datetime.now(timezone.utc)
    })

    print("✅ Super admin bootstrap creado")
