import time
from app.modules.onboarding.repo import TenantsRepo
from app.shared.ids import random_client_code_5, make_db_name
from app.security.hashing import hash_password
from app.security.jwt import mint_token, decode_token
from app.core.config import settings
from app.db.mongo import get_tenant_db

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

        client_code = claims["client_code"]
        email = claims["email"]
        jti = claims["jti"]

        tenant = await self.repo.get_by_client_code(client_code)
        if not tenant or tenant["email"] != email:
            raise ValueError("TOKEN_INVALID")
        if tenant.get("status") == "active":
            # idempotente opcional
            return {"status": "active", "tenant_db": tenant["db_name"]}

        # evita reuso si quieres: verifica jti
        if tenant.get("approval_jti") != jti:
            raise ValueError("TOKEN_REUSED_OR_INVALID")

        # Crear BD tenant (Mongo crea al escribir)
        tdb = get_tenant_db(tenant["db_name"])
        users = tdb["users"]
        await users.create_index("email", unique=True)

        # Crear usuario admin inicial
        await users.insert_one({
            "email": tenant["email"],
            "password_hash": tenant["password_hash"],
            "role": "owner",
            "created_at": int(time.time())
        })

        await self.repo.set_active(client_code)
        return {"status": "active", "tenant_db": tenant["db_name"]}
