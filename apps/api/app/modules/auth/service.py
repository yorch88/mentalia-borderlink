from app.db.mongo import get_global_db
from app.security.hashing import hash_password, verify_password
from app.security.jwt import mint_token, decode_token
from app.core.config import settings
import secrets
import string
import time
from app.modules.auth.repo import PasswordResetRepo 


async def login(email: str, password: str) -> dict:
    tenant = await get_global_db()["tenants"].find_one({"email": email})
    if not tenant or tenant.get("status") != "active":
        raise ValueError("INVALID_CREDENTIALS_OR_INACTIVE")

    if not verify_password(password, tenant["password_hash"]):
        raise ValueError("INVALID_CREDENTIALS")

    token = mint_token(
        {"sub": tenant["email"], "client_code": tenant["client_code"], "tenant_db": tenant["db_name"], "type": "access"},
        ttl_seconds=settings.ACCESS_TOKEN_TTL_SECONDS,
    )
    return {"access_token": token}


class AuthService:
    def __init__(self):
        self.repo = PasswordResetRepo()
        self.db = get_global_db()

    def _generate_pin(self) -> str:
        return f"{secrets.randbelow(10000):04d}"

    def _generate_request_id(self, size: int = 32) -> str:
        alphabet = string.ascii_letters + string.digits
        return "".join(secrets.choice(alphabet) for _ in range(size))
    
    async def login_user(self, email: str, password: str):
        user = await self.db["users"].find_one({"email": email})

        if not user:
            raise ValueError("INVALID_CREDENTIALS")

        if user.get("status") != "active":
            raise ValueError("USER_INACTIVE")

        if not user.get("password_hash"):
            raise ValueError("USER_NO_PASSWORD")

        if not verify_password(password, user["password_hash"]):
            raise ValueError("INVALID_CREDENTIALS")

        token = mint_token(
            {
                "sub": email,
                "tenant_id": str(user["tenant_id"]),
                "tenant_db": user["tenant_db"],
                "role": user["role"],
                "scope": "tenant",
                "type": "access"
            },
            ttl_seconds=settings.ACCESS_TOKEN_TTL_SECONDS
        )

        return {"access_token": token}

    async def forgot_password(self, email: str):
        """
        Flujo seguro:
        - no revela si el email existe o no
        - genera PIN por correo
        - genera challenge_token oculto para frontend
        """
        now = int(time.time())
        user = await self.db["users"].find_one({"email": email})

        # Siempre generamos challenge_token para no revelar existencia
        request_id = self._generate_request_id()
        challenge_token = mint_token(
            {
                "type": "reset_challenge",
                "email": email,
                "request_id": request_id,
            },
            ttl_seconds=120,  # 2 minutos
        )

        if not user:
            return {
                "message": "Si el correo existe, se envió un código de recuperación.",
                "challenge_token": challenge_token,
            }

        # Invalida solicitudes anteriores activas
        await self.repo.invalidate_previous_requests(email)

        pin = self._generate_pin()

        await self.repo.create({
            "email": email,
            "request_id": request_id,
            "pin_hash": hash_password(pin),
            "expires_at": now + 120,   # 2 min
            "used": False,
            "attempts": 0,
            "created_at": now,
        })

        return {
            "message": "Si el correo existe, se envió un código de recuperación.",
            "challenge_token": challenge_token,
            "pin": pin,  # quitar de la respuesta en prod si no lo usas para debug
        }

    async def verify_reset_pin(self, email: str, pin: str, challenge_token: str):
        now = int(time.time())

        claims = decode_token(challenge_token)

        if claims.get("type") != "reset_challenge":
            raise ValueError("INVALID_CHALLENGE_TOKEN")

        token_email = claims.get("email")
        request_id = claims.get("request_id")

        if not token_email or not request_id or token_email != email:
            raise ValueError("INVALID_CHALLENGE_TOKEN")

        record = await self.repo.get_active_by_email_and_request_id(email, request_id)

        if not record:
            raise ValueError("INVALID_OR_USED_REQUEST")

        if record.get("expires_at", 0) < now:
            raise ValueError("CODE_EXPIRED")

        if record.get("attempts", 0) >= 5:
            raise ValueError("TOO_MANY_ATTEMPTS")

        if not verify_password(pin, record["pin_hash"]):
            await self.repo.increment_attempts(record["_id"])
            raise ValueError("INVALID_CODE")

        await self.repo.mark_used(record["_id"])

        reset_token = mint_token(
            {
                "type": "password_reset",
                "email": email,
                "request_id": request_id,
            },
            ttl_seconds=600,  # 10 minutos para escribir nueva contraseña
        )

        return {
            "reset_token": reset_token
        }

    async def reset_password(self, reset_token: str, new_password: str):
        claims = decode_token(reset_token)

        if claims.get("type") != "password_reset":
            raise ValueError("INVALID_RESET_TOKEN")

        email = claims.get("email")
        if not email:
            raise ValueError("INVALID_RESET_TOKEN")

        user = await self.db["users"].find_one({"email": email})
        if not user:
            raise ValueError("USER_NOT_FOUND")

        await self.db["users"].update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "password_hash": hash_password(new_password),
                    "updated_at": int(time.time()),
                }
            }
        )

        return {
            "message": "PASSWORD_UPDATED"
        }
