from app.services.antibot_service import generate_nonce, is_valid_pow
from app.db.redis_client import store_nonce, get_nonce, mark_nonce_used
from app.core.config import settings

class AntibotService:

    def __init__(self):
        self.difficulty = settings.ANTIBOT_DIFFICULTY
        self.ttl = settings.ANTIBOT_TTL

    async def generate_challenge(self):
        nonce = generate_nonce()
        store_nonce(nonce, self.ttl)

        return {
            "nonce": nonce,
            "difficulty": self.difficulty,
            "expires_in": self.ttl
        }

    async def validate(self, pow):
        nonce_data = get_nonce(pow.nonce)

        if not nonce_data:
            return False, "Challenge inválido o expirado"

        if nonce_data.get("used"):
            return False, "Challenge ya utilizado"

        if not is_valid_pow(
            nonce=pow.nonce,
            counter=pow.counter,
            difficulty=self.difficulty
        ):
            return False, "Verificación antibot fallida"

        mark_nonce_used(pow.nonce)

        return True, None
