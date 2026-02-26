import time
from fastapi import HTTPException
from .repo import ClinicsRepo

repo = ClinicsRepo()

async def create_clinic(current_user, payload):

    if current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="No autorizado")

    clinic_doc = {
        "name": payload.name,
        "address": payload.address or {},
        "created_at": int(time.time())
    }

    clinic_id = await repo.insert(current_user["tenant_db"], clinic_doc)

    return {"id": str(clinic_id), "name": payload.name}

async def list_clinics(current_user):

    clinics = await repo.find_all(current_user["tenant_db"])

    result = []

    for c in clinics:
        result.append({
            "id": str(c["_id"]),
            "name": c["name"],
            "address": c.get("address", {})
        })

    return result