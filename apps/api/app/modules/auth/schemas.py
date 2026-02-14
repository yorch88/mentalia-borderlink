from pydantic import BaseModel, EmailStr, Field

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
