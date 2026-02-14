from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

def _normalize_password(password: str) -> str:
    # Evita límite de 72 bytes de bcrypt
    return hashlib.sha256(password.encode()).hexdigest()

def hash_password(password: str) -> str:
    return pwd_context.hash(_normalize_password(password))

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(_normalize_password(password), hashed)
