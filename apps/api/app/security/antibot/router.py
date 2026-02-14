from fastapi import APIRouter
from app.security.antibot.service import AntibotService

router = APIRouter(prefix="/v1/security", tags=["security"])

svc = AntibotService()

@router.get("/challenge")
async def get_challenge():
    return await svc.generate_challenge()