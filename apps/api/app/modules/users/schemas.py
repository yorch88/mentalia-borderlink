from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Literal


class CreateUserIn(BaseModel):
    email: EmailStr
    role: Literal["admin", "therapist", "receptionist"]
    clinic_ids: List[str]

    @validator("clinic_ids")
    def validate_clinics(cls, v):
        if not v:
            raise ValueError("Debe asignar al menos una clínica")
        if len(set(v)) != len(v):
            raise ValueError("Clínicas duplicadas")
        return v


class ActivateUserIn(BaseModel):
    token: str
    password: str = Field(min_length=8)


class AssignClinicsIn(BaseModel):
    clinic_ids: List[str]