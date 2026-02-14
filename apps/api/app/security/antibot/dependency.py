from fastapi import HTTPException, Request
from app.schemas.pow import PowIn
from app.security.antibot.service import AntibotService

svc = AntibotService()

async def antibot_protect(request: Request):

    body = await request.json()
    pow_data = body.get("pow")

    if not pow_data:
        raise HTTPException(status_code=400, detail="POW requerido")

    try:
        pow_obj = PowIn(**pow_data)
    except Exception:
        raise HTTPException(status_code=400, detail="POW inválido")

    valid, error = await svc.validate(pow_obj)

    if not valid:
        raise HTTPException(status_code=400, detail=error)
