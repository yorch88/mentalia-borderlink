from pydantic import BaseModel, Field

class CreateBranchIn(BaseModel):
    name: str = Field(min_length=2)
    address: dict | None = None

class BranchOut(BaseModel):
    id: str
    name: str