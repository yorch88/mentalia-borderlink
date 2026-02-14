from fastapi import APIRouter, HTTPException
from app.modules.auth.schemas import LoginIn, LoginOut
from app.modules.auth.service import login as login_service
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import APIRouter, Depends
from app.security.dependencies import security
from app.security.jwt import decode_token
from app.security.token_blacklist import blacklist_token
from app.security.dependencies import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/v1/auth", tags=["auth"])

@router.post("/login", response_model=LoginOut)
async def login(body: LoginIn):
    try:
        out = await login_service(body.email, body.password)
        return out
    except ValueError:
        raise HTTPException(status_code=401, detail="Credenciales inválidas o cuenta inactiva")

@router.get("/me")
async def me(current_user = Depends(get_current_user)):
    return {
        "authenticated": True,
        "email": current_user["email"],
        "role": current_user["role"],
        "tenant_db": current_user["tenant_db"]
    }

@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        claims = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    await blacklist_token(claims["jti"], claims["exp"])

    return {"message": "Logged out successfully"}
