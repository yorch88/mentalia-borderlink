from fastapi import APIRouter, HTTPException
from app.border_admin.global_auth.schemas import *
from app.border_admin.global_auth.service import GlobalAuthService

router = APIRouter(
    prefix="/v1/global-auth",
    tags=["global-auth"]
)

svc = GlobalAuthService()


@router.post("/login", response_model=GlobalLoginOut)
async def login(body: GlobalLoginIn):
    try:
        return await svc.login(body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
