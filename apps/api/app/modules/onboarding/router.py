from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from jinja2 import Environment, FileSystemLoader, select_autoescape
from datetime import datetime

from app.modules.onboarding.schemas import (
    RegisterIn,
    RegisterOut,
    ApproveIn,
    ApproveOut
)
from app.modules.onboarding.service import OnboardingService
from app.security.rate_limit import enforce_register_limit
from app.core.config import settings
from app.services.mailer import send_mail
from app.security.antibot.dependency import antibot_protect

router = APIRouter(prefix="/v1/onboarding", tags=["onboarding"])
templates = Jinja2Templates(directory="app/modules/onboarding/templates")

email_env = Environment(
    loader=FileSystemLoader("app/templates/emails"),
    autoescape=select_autoescape(["html", "xml"])
)

svc = OnboardingService()

# ---------------------------
# REGISTER (protegido con antibot)
# ---------------------------
@router.post("/register", response_model=RegisterOut)
async def register(
    body: RegisterIn,
    request: Request,
    _: None = Depends(antibot_protect)
):
    ip = request.client.host if request.client else "unknown"
    key = f"register:{ip}:{body.email}"

    try:
        await enforce_register_limit(
            key,
            settings.REGISTER_RATE_LIMIT_SECONDS
        )
    except ValueError:
        raise HTTPException(
            status_code=429,
            detail="Solo 1 registro cada 5 minutos"
        )

    try:
        result = await svc.register(body.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    template = email_env.get_template("new_registration.html")

    html_content = template.render(
        email=body.email,
        org_name=body.org_name,
        giro=body.giro,
        modules=", ".join(body.modules) if body.modules else "N/A",
        token=result["approval_token"],
        year=datetime.utcnow().year
    )

    await send_mail(
        subject="BorderLink - Nueva organización registrada",
        html=html_content
    )

    return {
        "client_code": result["client_code"],
        "db_name": result["db_name"],
        "status": "pending"
    }

# ---------------------------
# APPROVE TOKEN (NO necesita antibot)
# ---------------------------
@router.post("/approve", response_model=ApproveOut)
async def approve(body: ApproveIn):
    try:
        return await svc.approve(body.token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ---------------------------
# VERIFY PAGE (HTML)
# ---------------------------
@router.get("/verify", response_class=HTMLResponse, include_in_schema=False)
async def verify_page(request: Request, token: str):
    return templates.TemplateResponse(
        "verify.html",
        {"request": request, "token": token}
    )
