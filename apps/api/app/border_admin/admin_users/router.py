from fastapi import APIRouter, Depends, HTTPException
from app.border_admin.admin_users.schemas import *
from app.border_admin.admin_users.service import AdminUsersService
from app.security.authorization import require_global_roles
from app.security.antibot.dependency import antibot_protect

router = APIRouter(
    prefix="/v1/admin-users",
    tags=["border-admin-users"]
)

svc = AdminUsersService()


# =====================================================
# CREATE ADMIN
# =====================================================

@router.post("/")
async def create_admin(
    body: AdminCreateIn,
    _: None = Depends(antibot_protect),
    current_user=Depends(require_global_roles("super_admin"))
):
    try:
        return await svc.create_admin(body.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =====================================================
# APPROVE ADMIN (PUBLIC)
# =====================================================

@router.post("/approve")
async def approve_admin(body: AdminApproveIn):
    try:
        return await svc.approve_admin(body.token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =====================================================
# LIST ADMINS
# =====================================================

@router.get("/")
async def list_admins(
    current_user=Depends(require_global_roles("super_admin"))
):
    return await svc.list_admins()


# =====================================================
# CHANGE ROLE
# =====================================================

@router.put("/{email}/role")
async def change_role(
    email: str,
    body: AdminUpdateRoleIn,
    current_user=Depends(require_global_roles("super_admin"))
):
    try:
        await svc.update_role(
            current_user_email=current_user["email"],
            target_email=email,
            role=body.role
        )
        return {"status": "updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =====================================================
# CHANGE STATUS
# =====================================================

@router.put("/{email}/status")
async def change_status(
    email: str,
    body: AdminStatusUpdateIn,
    current_user=Depends(require_global_roles("super_admin"))
):
    try:
        await svc.update_status(
            current_user_email=current_user["email"],
            target_email=email,
            status=body.status
        )
        return {"status": "updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
