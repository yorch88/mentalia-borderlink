from fastapi import APIRouter, Depends, status
from app.security.dependencies import get_current_tenant_user
from .schemas import CreateUserIn
from .service import create_user, list_users

router = APIRouter(prefix="/v1/users", tags=["users"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create(body: CreateUserIn,
                 current_user=Depends(get_current_tenant_user)):
    return await create_user(current_user, body)

@router.get("/")
async def get_all(current_user=Depends(get_current_tenant_user)):
    return await list_users(current_user)