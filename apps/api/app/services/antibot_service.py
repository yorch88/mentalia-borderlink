import secrets
import hashlib
import time


DEFAULT_DIFFICULTY = 4
CHALLENGE_TTL_SECONDS = 120


def generate_nonce() -> str:
    return secrets.token_hex(16)


def compute_hash(nonce: str, counter: int) -> str:
    value = f"{nonce}{counter}".encode()
    return hashlib.sha256(value).hexdigest()


def is_valid_pow(nonce: str, counter: int, difficulty: int = DEFAULT_DIFFICULTY) -> bool:
    hash_result = compute_hash(nonce, counter)
    return hash_result.startswith("0" * difficulty)
