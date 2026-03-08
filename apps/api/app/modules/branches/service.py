import time
from fastapi import HTTPException
from .repo import BranchesRepo

repo = BranchesRepo()

async def create_branch(current_user, payload):

    if current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="No autorizado")

    branch_doc = {
        "name": payload.name,
        "address": payload.address or {},
        "created_at": int(time.time())
    }

    branch_id = await repo.insert(current_user["tenant_db"], branch_doc)

    return {"id": str(branch_id), "name": payload.name}

async def list_branches(current_user):

    branches = await repo.find_all(current_user["tenant_db"])

    result = []

    for c in branches:
        result.append({
            "id": str(c["_id"]),
            "name": c["name"],
            "address": c.get("address", {})
        })

    return result