import redis.asyncio as redis
from app.core.config import settings

_redis = None

async def get_redis():
    global _redis
    if _redis is None:
        _redis = redis.from_url(settings.REDIS_URI, decode_responses=True)
    return _redis

async def enforce_register_limit(key: str, ttl_seconds: int):
    r = await get_redis()
    exists = await r.get(key)
    if exists:
        raise ValueError("RATE_LIMIT")
    await r.set(key, "1", ex=ttl_seconds)
