from fastapi import APIRouter, Depends
from app.security.dependencies import get_current_tenant_user
from .schemas import CreateBranchIn
from .service import create_branch, list_branches

router = APIRouter(prefix="/v1/branches", tags=["branches"])

@router.post("/")
async def create(body: CreateBranchIn, current_user=Depends(get_current_tenant_user)):
    return await create_branch(current_user, body)

@router.get("/")
async def list_all(current_user=Depends(get_current_tenant_user)):
    return await list_branches(current_user)