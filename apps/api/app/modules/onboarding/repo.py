from app.db.mongo import get_global_db

class TenantsRepo:
    def __init__(self):
        self.col = get_global_db()["tenants"]

    async def insert_tenant(self, doc: dict):
        await self.col.insert_one(doc)

    async def get_by_email(self, email: str):
        return await self.col.find_one({"email": email})

    async def get_by_client_code(self, client_code: str):
        return await self.col.find_one({"client_code": client_code})

    async def set_active(self, client_code: str):
        await self.col.update_one({"client_code": client_code}, {"$set": {"status": "active"}})

class TermsRepo:
    def __init__(self):
        self.db = get_global_db()

    async def create(self, data: dict):
        return await self.db["terms"].insert_one(data)

    async def deactivate_all(self):
        await self.db["terms"].update_many(
            {"is_active": True},
            {"$set": {"is_active": False}}
        )

    async def get_active(self):
        return await self.db["terms"].find_one(
            {"is_active": True},
            sort=[("updated_at", -1)]
        )

    async def get_by_version(self, version: str):
        return await self.db["terms"].find_one({"version": version})