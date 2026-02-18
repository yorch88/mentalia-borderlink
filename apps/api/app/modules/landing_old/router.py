from fastapi import APIRouter, Depends
from app.modules.landing.schemas import LandingContent, ContactIn
from app.modules.landing.service import (
    get_landing,
    update_landing,
    save_contact
)
from app.security.dependencies import get_current_tenat_user
from app.security.antibot.dependency import antibot_protect
from jinja2 import Environment, FileSystemLoader, select_autoescape
from datetime import datetime
from app.services.mailer import send_mail

router = APIRouter(prefix="/v1/landing", tags=["landing"])

email_env = Environment(
    loader=FileSystemLoader("app/templates/emails"),
    autoescape=select_autoescape(["html", "xml"])
)

@router.get("/")
async def fetch_landing():
    return await get_landing()


# @router.put("/")
# async def modify_landing(
#     body: LandingContent,
#     current_user=Depends(get_current_tenat_user)
# ):
#     return await update_landing(body.dict())


@router.post("/contact")
async def submit_contact(
    body: ContactIn,
    _: None = Depends(antibot_protect)
):
    data = body.dict()

    # Guardar en DB
    await save_contact(data)

    # Renderizar template
    template = email_env.get_template("new_contact.html")

    html_content = template.render(
        name=data.get("name"),
        email=data.get("email"),
        phone=data.get("phone"),
        company=data.get("company"),
        message=data.get("message"),
        year=datetime.utcnow().year
    )

    # Enviar notificación
    await send_mail(
        subject="BorderLink - Nuevo mensaje de contacto",
        html=html_content
    )

    return {"status": "received"}

# @router.get("/")
# async def fetch_landing():
#     return await get_landing()


@router.put("/")
async def modify_landing(
    body: LandingContent
):
    return await update_landing(body.dict())


# @router.post("/contact")
# async def submit_contact(
#     body: ContactIn
# ):
#     return await save_contact(body.dict())
