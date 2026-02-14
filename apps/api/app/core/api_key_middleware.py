from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings


class InternalAPIKeyMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        # Solo proteger rutas internas
        if request.url.path.startswith("/v1/internal"):

            api_key = request.headers.get("X-API-KEY")

            if not api_key or api_key != settings.INTERNAL_API_KEY:
                raise HTTPException(status_code=403, detail="Invalid API Key")

        return await call_next(request)
