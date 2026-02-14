import aiosmtplib
from email.mime.text import MIMEText
from app.core.config import settings


async def send_mail(subject: str, html: str):
    recipients = [
        email.strip()
        for email in settings.EMAIL_TO.split(",")
        if email.strip()
    ]

    msg = MIMEText(html, "html", "utf-8")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = ", ".join(recipients)

    await aiosmtplib.send(
        msg,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USERNAME,
        password=settings.SMTP_PASSWORD,
        start_tls=True,
        recipients=recipients,
    )
