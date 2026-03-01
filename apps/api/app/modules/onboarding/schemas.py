from pydantic import BaseModel, EmailStr, Field
from typing import List, Literal, Optional
from typing_extensions import Annotated
from datetime import datetime, timezone


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
    phone: Optional[str] = None
    giro: str = Field(min_length=2)
    org_name: str = Field(min_length=2)
    phone: str
    modules: List[str] = Field(default_factory=list)
    plan: Optional[Literal["basico", "standar", "premium"]] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    terms_accepted: bool
    terms_version: str
    pow: PowPayload

# Estas son las nuevas clases schema para terminos

class Clause(BaseModel):
    title: str
    text: str


class Terms(BaseModel):
    version: str
    title: str
    document_type: Literal["terms", "privacy"] = "privacy"
    document_url: Optional[str] = None
    requires_sensitive_consent: bool = False
    legal_basis: Optional[str] = None
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    clauses: List[Clause]
    is_active: bool = True