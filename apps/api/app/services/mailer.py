import aiosmtplib
from email.mime.text import MIMEText
from typing import Union, List, Optional
from app.core.config import settings


async def send_mail(
    subject: str,
    html: str,
    to: Optional[Union[str, List[str]]] = None,
    cc: Optional[List[str]] = None,
    bcc: Optional[List[str]] = None,
):
    """
    Backward compatible mailer.

    - Si `to` no se pasa → usa EMAIL_TO (admin/internal)
    - Si `to` se pasa → envía al usuario final
    """

    # 🔵 destinatario por defecto (NO rompe tu código actual)
    if not to:
        recipients = [
            email.strip()
            for email in settings.EMAIL_TO.split(",")
            if email.strip()
        ]
    else:
        # normalizar
        if isinstance(to, str):
            recipients = [to]
        else:
            recipients = to

    # incluir cc y bcc
    all_recipients = list(recipients)

    if cc:
        all_recipients.extend(cc)

    if bcc:
        all_recipients.extend(bcc)

    msg = MIMEText(html, "html", "utf-8")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = ", ".join(recipients)

    if cc:
        msg["Cc"] = ", ".join(cc)

    # ⚠️ BCC NO se pone en headers (correcto)
    # solo se agrega en recipients

    await aiosmtplib.send(
        msg,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USERNAME,
        password=settings.SMTP_PASSWORD,
        start_tls=True,
        recipients=all_recipients,
    )