from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "type": "http_error",
                "message": exc.detail
            }
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "type": "validation_error",
                "details": exc.errors()
            }
        }
    )


async def generic_exception_handler(request: Request, exc: Exception):
    # En producción no mostrar detalles internos
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "type": "internal_server_error",
                "message": "An unexpected error occurred"
            }
        }
    )
