from pydantic import BaseModel

class PowIn(BaseModel):
    nonce: str
    counter: int