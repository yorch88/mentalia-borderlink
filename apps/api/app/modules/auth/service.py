from app.db.mongo import get_global_db
from app.security.hashing import verify_password
from app.security.jwt import mint_token
from app.core.config import settings

async def login(email: str, password: str) -> dict:
    tenant = await get_global_db()["tenants"].find_one({"email": email})
    if not tenant or tenant.get("status") != "active":
        raise ValueError("INVALID_CREDENTIALS_OR_INACTIVE")

    if not verify_password(password, tenant["password_hash"]):
        raise ValueError("INVALID_CREDENTIALS")

    token = mint_token(
        {"sub": tenant["email"], "client_code": tenant["client_code"], "tenant_db": tenant["db_name"], "type": "access"},
        ttl_seconds=settings.ACCESS_TOKEN_TTL_SECONDS,
    )
    return {"access_token": token}
