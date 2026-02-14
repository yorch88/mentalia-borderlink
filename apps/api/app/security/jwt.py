import time
import uuid
from jose import jwt
from jose.exceptions import JWTError
from app.core.config import settings


def mint_token(payload: dict, ttl_seconds: int) -> str:
    now = int(time.time())

    data = {
        **payload,
        "iat": now,
        "exp": now + ttl_seconds,
        "jti": uuid.uuid4().hex,
    }

    return jwt.encode(data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
