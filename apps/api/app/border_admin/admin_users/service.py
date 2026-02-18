import time
from app.db.mongo import get_global_db
from app.security.hashing import hash_password
from app.security.jwt import mint_token, decode_token
from app.core.config import settings


class AdminUsersService:

    def __init__(self):
        self.db = get_global_db()
        self.col = self.db["admin_users"]

    # =====================================================
    # CREATE ADMIN (PENDING)
    # =====================================================

    async def create_admin(self, payload: dict):

        existing = await self.col.find_one({"email": payload["email"]})
        if existing:
            raise ValueError("ADMIN_ALREADY_EXISTS")

        approval_token = mint_token(
            {
                "sub": payload["email"],
                "type": "admin_approval",
                "scope": "global"
            },
            ttl_seconds=settings.APPROVAL_TOKEN_TTL_SECONDS
        )

        claims = decode_token(approval_token)

        doc = {
            "email": payload["email"],
            "password_hash": hash_password(payload["password"]),
            "role": payload["role"],
            "status": "pending",
            "approval_jti": claims["jti"],
            "created_at": int(time.time())
        }

        await self.col.insert_one(doc)

        return {"status": "pending", "approval_token": approval_token}

    # =====================================================
    # APPROVE ADMIN
    # =====================================================

    async def approve_admin(self, token: str):

        claims = decode_token(token)

        if claims.get("type") != "admin_approval":
            raise ValueError("TOKEN_INVALID")

        email = claims["sub"]
        jti = claims["jti"]

        admin = await self.col.find_one({"email": email})
        if not admin:
            raise ValueError("TOKEN_INVALID")

        if admin.get("approval_jti") != jti:
            raise ValueError("TOKEN_REUSED_OR_INVALID")

        if admin["status"] == "active":
            return {"status": "active"}

        await self.col.update_one(
            {"email": email},
            {"$set": {"status": "active"}}
        )

        return {"status": "active"}

    # =====================================================
    # LIST ADMINS
    # =====================================================

    async def list_admins(self):
        cursor = self.col.find({}, {"_id": 0, "password_hash": 0})
        return [doc async for doc in cursor]

    # =====================================================
    # UPDATE ROLE
    # =====================================================

    async def update_role(self, current_user_email: str, target_email: str, role: str):

        admin = await self.col.find_one({"email": target_email})
        if not admin:
            raise ValueError("ADMIN_NOT_FOUND")

        # 🚨 No permitir degradar el último super_admin
        if admin["role"] == "super_admin" and role != "super_admin":
            count = await self.col.count_documents({
                "role": "super_admin",
                "status": "active"
            })
            if count <= 1:
                raise ValueError("CANNOT_DOWNGRADE_LAST_SUPER_ADMIN")

        await self.col.update_one(
            {"email": target_email},
            {"$set": {"role": role}}
        )

    # =====================================================
    # UPDATE STATUS (ACTIVATE / DISABLE)
    # =====================================================

    async def update_status(self, current_user_email: str, target_email: str, status: str):

        admin = await self.col.find_one({"email": target_email})
        if not admin:
            raise ValueError("ADMIN_NOT_FOUND")

        # 🚨 No permitir desactivar el último super_admin
        if admin["role"] == "super_admin" and status != "active":
            count = await self.col.count_documents({
                "role": "super_admin",
                "status": "active"
            })
            if count <= 1:
                raise ValueError("CANNOT_DISABLE_LAST_SUPER_ADMIN")

        await self.col.update_one(
            {"email": target_email},
            {"$set": {"status": status}}
        )
