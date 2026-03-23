from pydantic import BaseModel, EmailStr, Field

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class SetPasswordIn(BaseModel):
    token: str
    password: str = Field(min_length=8)
    

class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ForgotPasswordOut(BaseModel):
    message: str
    challenge_token: str


class VerifyResetPinIn(BaseModel):
    email: EmailStr
    pin: str = Field(min_length=4, max_length=4)
    challenge_token: str


class VerifyResetPinOut(BaseModel):
    reset_token: str


class ResetPasswordIn(BaseModel):
    reset_token: str
    new_password: str = Field(min_length=8)


class ResetPasswordOut(BaseModel):
    message: str