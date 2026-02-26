import time
from app.modules.onboarding.repo import TenantsRepo
from app.shared.ids import random_client_code_5, make_db_name
from app.security.hashing import hash_password
from app.security.jwt import mint_token, decode_token
from app.core.config import settings
from app.db.mongo import get_tenant_db, get_global_db

class OnboardingService:
    def __init__(self):
        self.repo = TenantsRepo()

    async def register(self, payload: dict) -> dict:
        # Generar códigos (reintenta si colisiona)
        for _ in range(10):
            client_code = random_client_code_5()
            db_name = make_db_name(client_code)
            if not await self.repo.get_by_client_code(client_code):
                break
        else:
            raise RuntimeError("No se pudo generar client_code único")

        approval_token = mint_token(
            {"client_code": client_code, "email": payload["email"], "type": "approval"},
            ttl_seconds=settings.APPROVAL_TOKEN_TTL_SECONDS,
        )
        approval_claims = decode_token(approval_token)

        doc = {
            "client_code": client_code,
            "db_name": db_name,
            "email": payload["email"],
            "password_hash": hash_password(payload["password"]),
            "giro": payload["giro"],
            "org_name": payload["org_name"],
            "modules": payload.get("modules", []),
            "plan": payload.get("plan"),
            "status": "pending",
            "approval_jti": approval_claims["jti"],
            "created_at": int(time.time()),
        }
        await self.repo.insert_tenant(doc)

        return {"client_code": client_code, "db_name": db_name, "approval_token": approval_token}

    async def approve(self, token: str) -> dict:
        claims = decode_token(token)

        if claims.get("type") != "approval":
            raise ValueError("TOKEN_INVALID")

        client_code = claims.get("client_code")
        email = claims.get("email")
        jti = claims.get("jti")

        if not client_code or not email or not jti:
            raise ValueError("TOKEN_INVALID")

        tenant = await self.repo.get_by_client_code(client_code)

        if not tenant or tenant["email"] != email:
            raise ValueError("TOKEN_INVALID")

        # Idempotente: si ya está activo, devolver estado actual
        if tenant.get("status") == "active":
            return {
                "status": "active",
                "tenant_db": tenant["db_name"]
            }

        # Verificar que el token no haya sido reutilizado
        if tenant.get("approval_jti") != jti:
            raise ValueError("TOKEN_REUSED_OR_INVALID")

        # ---------------------------
        # 1️⃣ Crear usuario OWNER en GLOBAL DB
        # ---------------------------

        from app.db.mongo import get_global_db, get_tenant_db

        global_db = get_global_db()

        user_doc = {
            "email": tenant["email"],
            "password_hash": tenant["password_hash"],
            "tenant_id": tenant["_id"],
            "tenant_db": tenant["db_name"],
            "role": "owner",
            "status": "active",
            "created_at": int(time.time())
        }

        result = await global_db["users"].insert_one(user_doc)

        # ---------------------------
        # 2️⃣ Crear referencia ligera en TENANT DB
        # ---------------------------

        tdb = get_tenant_db(tenant["db_name"])

        await tdb["users"].insert_one({
            "_id": result.inserted_id,
            "role": "owner",
            "created_at": int(time.time())
        })

        # ---------------------------
        # 3️⃣ (Opcional recomendado) Crear clínica default
        # ---------------------------

        await tdb["clinics"].insert_one({
            "name": "Clínica Principal",
            "is_default": True,
            "created_at": int(time.time())
        })

        # ---------------------------
        # 4️⃣ Marcar tenant como activo
        # ---------------------------

        await self.repo.set_active(client_code)

        return {
            "status": "active",
            "tenant_db": tenant["db_name"]
        }

        result = await global_db["users"].insert_one(user_doc)

        # 2️⃣ Crear referencia ligera en TENANT DB
        tdb = get_tenant_db(tenant["db_name"])

        await tdb["users"].insert_one({
            "_id": result.inserted_id,   # ← mismo ID que global
            "role": "owner",
            "created_at": int(time.time())
        })
