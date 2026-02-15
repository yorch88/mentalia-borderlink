import os
import secrets
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html

from app.core.lifespan import lifespan
from app.modules.onboarding.router import router as onboarding_router
from app.modules.auth.router import router as auth_router
from app.modules.landing.router import router as land_router
from app.security.antibot.router import router as antibot_router


# =====================================================
# Environment Config
# =====================================================

APP_ENV = os.getenv("APP_ENV", "development")
APP_NAME = os.getenv("APP_NAME", "Borderlink API")
ROOT_PATH = os.getenv("APP_ROOT_PATH", "").rstrip("/")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

SWAGGER_USER = os.getenv("SWAGGER_USER")
SWAGGER_PASSWORD = os.getenv("SWAGGER_PASSWORD")


# =====================================================
# App Initialization
# =====================================================

app = FastAPI(
    title=APP_NAME,
    lifespan=lifespan,
    root_path=ROOT_PATH,
    docs_url=None,
    redoc_url=None,
    debug=DEBUG
)


# =====================================================
# CORS (Dynamic)
# =====================================================

origins = os.getenv("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in origins.split(",") if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"] if DEBUG else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# Routers
# =====================================================

app.include_router(onboarding_router)
app.include_router(auth_router)
app.include_router(land_router)
app.include_router(antibot_router)


# =====================================================
# Health Check
# =====================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "environment": APP_ENV
    }


# =====================================================
# Protected Swagger
# =====================================================

security = HTTPBasic()

def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    if not SWAGGER_USER or not SWAGGER_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Swagger credentials not configured"
        )

    correct_username = secrets.compare_digest(credentials.username, SWAGGER_USER)
    correct_password = secrets.compare_digest(credentials.password, SWAGGER_PASSWORD)

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Basic"},
        )


@app.get("/docs", include_in_schema=False)
def protected_swagger(credentials: HTTPBasicCredentials = Depends(verify_credentials)):
    openapi_path = f"{ROOT_PATH}/openapi.json" if ROOT_PATH else "/openapi.json"

    return get_swagger_ui_html(
        openapi_url=openapi_path,
        title=f"{APP_NAME} - Docs"
    )
