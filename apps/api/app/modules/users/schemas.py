from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Literal


class CreateUserIn(BaseModel):
    email: EmailStr
    role: Literal["admin", "receptionist", "therapist"]
    branches_ids: List[str]

    @validator("branches_ids")
    def validate_branches(cls, v):
        if not v:
            raise ValueError("Debe asignar al menos una Sucurasl/clínica")
        if len(set(v)) != len(v):
            raise ValueError("Sucursal/Clínica duplicada")
        return v


class ActivateUserIn(BaseModel):
    token: str
    password: str = Field(min_length=8)


class AssignBranchesIn(BaseModel):
    branches_ids: List[str]