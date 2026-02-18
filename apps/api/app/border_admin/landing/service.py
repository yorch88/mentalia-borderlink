from app.db.mongo import get_global_db

async def get_landing():
    db = get_global_db()
    landing = await db["landing"].find_one({}, {"_id": 0})
    return landing


async def update_landing(data: dict):
    db = get_global_db()
    await db["landing"].update_one(
        {},
        {"$set": data},
        upsert=True
    )
    return await db["landing"].find_one({}, {"_id": 0})


async def save_contact(data: dict):
    db = get_global_db()
    await db["landing_contacts"].insert_one(data)
    return {"message": "Contact saved"}
