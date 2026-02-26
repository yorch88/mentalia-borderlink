from fastapi import APIRouter, Depends
from app.security.dependencies import get_current_tenant_user
from .schemas import CreateClinicIn
from .service import create_clinic, list_clinics

router = APIRouter(prefix="/v1/clinics", tags=["clinics"])

@router.post("/")
async def create(body: CreateClinicIn, current_user=Depends(get_current_tenant_user)):
    return await create_clinic(current_user, body)

@router.get("/")
async def list_all(current_user=Depends(get_current_tenant_user)):
    return await list_clinics(current_user)