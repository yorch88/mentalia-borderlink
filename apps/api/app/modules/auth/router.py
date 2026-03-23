from fastapi import APIRouter, HTTPException
from app.modules.auth.schemas import LoginIn, LoginOut
from app.modules.auth.service import login as login_service
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import APIRouter, Depends
from app.security.dependencies import security
from app.security.jwt import decode_token
from app.security.token_blacklist import blacklist_token
from app.security.dependencies import get_current_tenant_user
from app.core.config import settings
from app.modules.auth.service import AuthService
from app.services.mailer import send_mail
from datetime import datetime
from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.modules.auth.schemas import (
    ForgotPasswordIn,
    ForgotPasswordOut,
    VerifyResetPinIn,
    VerifyResetPinOut,
    ResetPasswordIn,
    ResetPasswordOut,
)

router = APIRouter(prefix="/v1/auth", tags=["auth"])
svc = AuthService()

email_env = Environment(
    loader=FileSystemLoader("app/templates/emails"),
    autoescape=select_autoescape(["html", "xml"])
)

# @router.post("/login", response_model=LoginOut)
# async def login(body: LoginIn):
#     try:
#         out = await login_service(body.email, body.password)
#         return out
#     except ValueError:
#         raise HTTPException(status_code=401, detail="Credenciales inválidas o cuenta inactiva")
@router.post("/login")
async def login(body: dict):
    try:
        return await svc.login_user(body["email"], body["password"])
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
                            
@router.get("/me")
async def me(current_user = Depends(get_current_tenant_user)):
    return {
        "authenticated": True,
        "email": current_user["email"],
        "role": current_user["role"],
        "tenant_db": current_user["tenant_db"]
    }

@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        claims = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    await blacklist_token(claims["jti"], claims["exp"])

    return {"message": "Logged out successfully"}


@router.post("/forgot-password", response_model=ForgotPasswordOut)
async def forgot_password(body: ForgotPasswordIn):
    try:
        result = await svc.forgot_password(body.email)

        # Si existe pin, significa que el usuario existe y se envía correo
        pin = result.get("pin")
        if pin:
            template = email_env.get_template("reset_password_pin.html")
            html_content = template.render(
                email=body.email,
                pin=pin,
                minutes=2,
                year=datetime.utcnow().year,
            )

            # IMPORTANTE:
            # si tu send_mail actual no recibe `to`, debes ajustarlo en tu mailer.
            await send_mail(
                to=body.email,
                subject="BorderLink - Código para restablecer contraseña",
                html=html_content,
            )

        return {
            "message": result["message"],
            "challenge_token": result["challenge_token"],
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/verify-reset-pin", response_model=VerifyResetPinOut)
async def verify_reset_pin(body: VerifyResetPinIn):
    try:
        return await svc.verify_reset_pin(
            email=body.email,
            pin=body.pin,
            challenge_token=body.challenge_token,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/reset-password", response_model=ResetPasswordOut)
async def reset_password(body: ResetPasswordIn):
    try:
        return await svc.reset_password(
            reset_token=body.reset_token,
            new_password=body.new_password,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))