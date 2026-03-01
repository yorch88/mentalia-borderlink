from fastapi import APIRouter, Request, HTTPException, Depends, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from jinja2 import Environment, FileSystemLoader, select_autoescape
from datetime import datetime

from app.security.dependencies import get_current_global_user
from app.modules.onboarding.schemas import (
    RegisterIn,
    RegisterOut,
    ApproveIn,
    ApproveOut,
    Terms
)
from app.security.jwt import decode_token
from app.modules.onboarding.service import OnboardingService, TermsService 
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
svc_term = TermsService()
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

    frontend_url = settings.FRONTEND_VERIFY_URL
    activation_url = f"{frontend_url}/basic-approve-client?token={result['approval_token']}"
    
    template = email_env.get_template("new_registration.html")

    html_content = template.render(
        email=body.email,
        org_name=body.org_name,
        giro=body.giro,
        phone=body.phone,
        modules=", ".join(body.modules) if body.modules else "N/A",
        token=result["approval_token"],
        activation_url=activation_url,
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


@router.get("/approve-preview")
async def approve_preview(token: str):
    try:
        claims = decode_token(token)

        if claims.get("type") != "approval":
            raise ValueError("TOKEN_INVALID")

        tenant = await svc.repo.get_by_client_code(claims["client_code"])

        if not tenant:
            raise ValueError("TOKEN_INVALID")

        return {
            "email": tenant["email"],
            "org_name": tenant["org_name"],
            "giro": tenant["giro"],
            "modules": tenant.get("modules", []),
            "status": tenant["status"]
        }

    except Exception:
        raise HTTPException(status_code=400, detail="INVALID_TOKEN")


# implementar algo asi para terminos validadno global user
@router.post("/terms", status_code=status.HTTP_201_CREATED)
async def create_terms(
    body: Terms,
    current_admin=Depends(get_current_global_user)
):
    if current_admin.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="FORBIDDEN")

    try:
        return await svc_term.create_terms(body)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/terms", response_model=Terms, status_code=status.HTTP_200_OK)
async def get_terms():
    try:
        return await svc_term.get_active_terms()
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e))