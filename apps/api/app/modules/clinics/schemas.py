from pydantic import BaseModel, Field

class CreateClinicIn(BaseModel):
    name: str = Field(min_length=2)
    address: dict | None = None

class ClinicOut(BaseModel):
    id: str
    name: str