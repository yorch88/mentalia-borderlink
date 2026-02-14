from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.security.jwt import decode_token
from app.db.mongo import get_tenant_db
from app.core.config import settings
from app.security.token_blacklist import is_token_blacklisted

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        claims = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    if claims.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")

    tenant_db_name = claims.get("tenant_db")
    email = claims.get("sub")

    if not tenant_db_name or not email:
        raise HTTPException(status_code=401, detail="Malformed token")

    db = get_tenant_db(tenant_db_name)
    user = await db["users"].find_one({"email": email})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return {
        "email": user["email"],
        "role": user.get("role"),
        "tenant_db": tenant_db_name,
    }
