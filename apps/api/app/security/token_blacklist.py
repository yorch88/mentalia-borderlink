import redis.asyncio as redis
from app.core.config import settings

_redis = redis.from_url(settings.REDIS_URI)

async def blacklist_token(jti: str, exp: int):
    ttl = exp - int(__import__("time").time())
    if ttl > 0:
        await _redis.setex(f"bl:{jti}", ttl, "1")

async def is_token_blacklisted(jti: str) -> bool:
    value = await _redis.get(f"bl:{jti}")
    return value is not None
