# apps/api/app/modules/users/repo.py

import time
from bson import ObjectId
from bson.errors import InvalidId
from app.db.mongo import get_global_db, get_tenant_db


class UsersRepo:

    # -------- GLOBAL --------

    async def find_global_by_email(self, email: str):
        return await get_global_db()["users"].find_one({"email": email})

    async def find_global_by_id(self, user_id: str):
        try:
            return await get_global_db()["users"].find_one({"_id": ObjectId(user_id)})
        except InvalidId:
            return None

    async def insert_global(self, doc: dict):
        result = await get_global_db()["users"].insert_one(doc)
        return result.inserted_id

    async def update_global(self, user_id, update: dict):
        await get_global_db()["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update}
        )


    async def list_global_users_by_tenant(self, tenant_id):
        cursor = get_global_db()["users"].find({
            "tenant_id": tenant_id,
            "status": "active"
        })
        return [doc async for doc in cursor]
    # -------- TENANT --------

    async def insert_tenant_user(self, tenant_db: str, doc: dict):
        await get_tenant_db(tenant_db)["users"].insert_one(doc)

    async def branch_exists(self, tenant_db: str, branch_id: str):
        try:
            return await get_tenant_db(tenant_db)["branches"].find_one({
                "_id": ObjectId(branch_id)
            })
        except InvalidId:
            return None

    async def insert_user_branch(self, tenant_db: str, user_id, branch_id):
        await get_tenant_db(tenant_db)["user_branches"].update_one(
            {
                "user_id": user_id,
                "branch_id": ObjectId(branch_id)
            },
            {
                "$setOnInsert": {
                    "user_id": user_id,
                    "branch_id": ObjectId(branch_id),
                    "created_at": int(time.time())
                }
            },
            upsert=True
        )

    async def delete_user_branches(self, tenant_db: str, user_id):
        await get_tenant_db(tenant_db)["user_branches"].delete_many({
            "user_id": user_id
        })

    async def get_user_branches(self, tenant_db: str, user_id):
        cursor = get_tenant_db(tenant_db)["user_branches"].find({
            "user_id": user_id
        })
        return [doc async for doc in cursor]


    async def list_tenant_users(self, tenant_db: str):
        cursor = get_tenant_db(tenant_db)["users"].find({})
        return [doc async for doc in cursor]