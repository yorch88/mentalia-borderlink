from app.db.mongo import get_global_db


class PasswordResetRepo:
    def __init__(self):
        self.col = get_global_db()["password_resets"]

    async def create(self, doc: dict):
        return await self.col.insert_one(doc)

    async def get_active_by_email_and_request_id(self, email: str, request_id: str):
        return await self.col.find_one({
            "email": email,
            "request_id": request_id,
            "used": False,
        })

    async def invalidate_previous_requests(self, email: str):
        return await self.col.update_many(
            {
                "email": email,
                "used": False,
            },
            {
                "$set": {
                    "used": True,
                    "invalidated": True,
                }
            }
        )

    async def mark_used(self, _id):
        return await self.col.update_one(
            {"_id": _id},
            {"$set": {"used": True}}
        )

    async def increment_attempts(self, _id):
        return await self.col.update_one(
            {"_id": _id},
            {"$inc": {"attempts": 1}}
        )