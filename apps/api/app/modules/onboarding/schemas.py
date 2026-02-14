from pydantic import BaseModel, EmailStr, Field
from typing import List
from typing_extensions import Annotated


class RegisterOut(BaseModel):
    client_code: str
    db_name: str
    status: str = "pending"


class ApproveIn(BaseModel):
    token: str


class ApproveOut(BaseModel):
    status: str
    tenant_db: str


class PowPayload(BaseModel):
    nonce: str = Field(min_length=10)
    counter: int = Field(ge=0)


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    giro: str = Field(min_length=2)
    org_name: str = Field(min_length=2)
    modules: List[str] = Field(default_factory=list)
    pow: PowPayload
