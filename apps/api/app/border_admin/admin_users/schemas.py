from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional

RoleType = Literal[
    "super_admin",
    "admin_editor",
    "admin_support"
]


class AdminCreateIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: RoleType


class AdminApproveIn(BaseModel):
    token: str


class AdminOut(BaseModel):
    email: EmailStr
    role: RoleType
    status: str


class AdminUpdateRoleIn(BaseModel):
    role: RoleType


class AdminStatusUpdateIn(BaseModel):
    status: Literal["active", "disabled"]



class GlobalLoginIn(BaseModel):
    email: EmailStr
    password: str


class GlobalLoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"