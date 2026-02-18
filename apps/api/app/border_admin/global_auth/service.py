
from app.db.mongo import get_global_db
from app.security.hashing import verify_password
from app.security.jwt import mint_token
from app.core.config import settings


class GlobalAuthService:

    def __init__(self):
        self.db = get_global_db()
        self.col = self.db["admin_users"]

    async def login(self, email: str, password: str):

        admin = await self.col.find_one({"email": email})

        if not admin:
            raise ValueError("INVALID_CREDENTIALS")

        if admin.get("status") != "active":
            raise ValueError("USER_INACTIVE")

        if not verify_password(password, admin["password_hash"]):
            raise ValueError("INVALID_CREDENTIALS")

        access_token = mint_token(
            {
                "sub": email,
                "role": admin["role"],
                "scope": "global",
                "type": "access"
            },
            ttl_seconds=settings.ACCESS_TOKEN_TTL_SECONDS
        )

        return {"access_token": access_token}
