from pydantic import BaseModel, EmailStr


class GlobalLoginIn(BaseModel):
    email: EmailStr
    password: str


class GlobalLoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"