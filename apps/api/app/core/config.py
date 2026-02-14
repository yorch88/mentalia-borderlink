from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):

    # ==============================
    # APP
    # ==============================
    APP_NAME: str = "borderlink-api"
    APP_ENV: str = "development"  # development | production
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    DEBUG: bool = True
    APP_ROOT_PATH: str = ""
    # ==============================
    # SECURITY
    # ==============================
    SECRET_KEY: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_TTL_SECONDS: int = 60 * 60 * 8
    APPROVAL_TOKEN_TTL_SECONDS: int = 60 * 60 * 24
    INTERNAL_API_KEY: str

    # ==============================
    # DATABASE
    # ==============================
    MONGO_URI: str
    GLOBAL_DB_NAME: str = "borderlink_global"

    # ==============================
    # REDIS
    # ==============================
    REDIS_URI: str
    REGISTER_RATE_LIMIT_SECONDS: int = 300
    LOGIN_RATE_LIMIT_SECONDS: int = 60

    # ==============================
    # CAPTCHA
    # ==============================
    CAPTCHA_PROVIDER: str = "hcaptcha"
    CAPTCHA_SECRET: str
    CAPTCHA_BYPASS: bool = False

    # ==============================
    # EMAIL
    # ==============================
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_FROM: str
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    EMAIL_TO: str

    # ==============================
    # FRONTEND
    # ==============================
    FRONTEND_VERIFY_URL: str

    # ==============================
    # CORS
    # ==============================
    ALLOWED_ORIGINS: str = ""
    SWAGGER_USER: str
    SWAGGER_PASSWORD: str
    
    ANTIBOT_DIFFICULTY: int = 4
    ANTIBOT_TTL: int = 120

    REDIS_HOST: str
    REDIS_PORT: str

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() == "production"

    @property
    def cors_origins(self) -> List[str]:
        if not self.ALLOWED_ORIGINS:
            return []
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()
