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
