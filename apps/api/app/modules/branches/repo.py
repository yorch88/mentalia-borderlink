import time
from bson import ObjectId
from app.db.mongo import get_tenant_db

class BranchesRepo:

    async def insert(self, tenant_db: str, doc: dict):
        result = await get_tenant_db(tenant_db)["branches"].insert_one(doc)
        return result.inserted_id

    async def find_all(self, tenant_db: str):
        cursor = get_tenant_db(tenant_db)["branches"].find({})
        return [doc async for doc in cursor]

    async def find_by_id(self, tenant_db: str, branch_id: str):
        return await get_tenant_db(tenant_db)["branches"].find_one({
            "_id": ObjectId(branch_id)
        })