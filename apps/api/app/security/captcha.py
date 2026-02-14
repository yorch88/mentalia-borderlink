import aiohttp
from app.core.config import settings


HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify"


async def verify_captcha(token: str, remoteip: str | None = None) -> bool:

    if settings.CAPTCHA_BYPASS:
        return True

    data = {
        "secret": settings.CAPTCHA_SECRET,
        "response": token
    }

    if remoteip:
        data["remoteip"] = remoteip

    async with aiohttp.ClientSession() as session:
        async with session.post(HCAPTCHA_VERIFY_URL, data=data) as resp:
            result = await resp.json()
            return bool(result.get("success"))
