import os
import redis
import json

REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True
)


# ---------- NONCE MANAGEMENT ----------

def store_nonce(nonce: str, ttl: int):
    data = {
        "used": False
    }

    redis_client.setex(
        f"pow:{nonce}",
        ttl,
        json.dumps(data)
    )


def get_nonce(nonce: str):
    value = redis_client.get(f"pow:{nonce}")
    if not value:
        return None
    return json.loads(value)


def mark_nonce_used(nonce: str):
    value = get_nonce(nonce)
    if not value:
        return

    value["used"] = True

    redis_client.set(
        f"pow:{nonce}",
        json.dumps(value)
    )
