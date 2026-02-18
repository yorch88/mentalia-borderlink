from fastapi import Depends, HTTPException
from app.security.dependencies import get_current_global_user

def require_global_roles(*roles):
    async def checker(user=Depends(get_current_global_user)):
        if user["role"] not in roles:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        return user
    return checker
