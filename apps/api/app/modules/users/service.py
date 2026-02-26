import time
from fastapi import HTTPException
from app.security.jwt import mint_token, decode_token
from ..users.repo import UsersRepo
from ..users.constants import CREATABLE_ROLES

repo = UsersRepo()


async def create_user(current_user, payload):

    if current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="No autorizado")

    if payload.role not in CREATABLE_ROLES:
        raise HTTPException(status_code=400, detail="Rol inválido")

    # Validar clínicas
    for clinic_id in payload.clinic_ids:
        exists = await repo.clinic_exists(
            current_user["tenant_db"],
            clinic_id
        )
        if not exists:
            raise HTTPException(
                status_code=400,
                detail=f"Clínica inválida: {clinic_id}"
            )

    existing = await repo.find_global_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    activation_token = mint_token(
        {
            "email": payload.email,
            "tenant_id": str(current_user["tenant_id"]),
            "tenant_db": current_user["tenant_db"],
            "role": payload.role,
            "type": "activate_user"
        },
        ttl_seconds=60 * 60 * 24
    )

    claims = decode_token(activation_token)

    global_user = {
        "email": payload.email,
        "password_hash": None,
        "tenant_id": current_user["tenant_id"],
        "tenant_db": current_user["tenant_db"],
        "role": payload.role,
        "status": "pending",
        "activation_jti": claims["jti"],
        "created_at": int(time.time())
    }

    # 1️⃣ Insert global
    user_id = await repo.insert_global(global_user)

    try:
        # 2️⃣ Insert tenant user
        await repo.insert_tenant_user(
            current_user["tenant_db"],
            {
                "_id": user_id,
                "role": payload.role,
                "created_at": int(time.time())
            }
        )

        # 3️⃣ Insert relations
        for clinic_id in payload.clinic_ids:
            await repo.insert_user_clinic(
                current_user["tenant_db"],
                user_id,
                clinic_id
            )

    except Exception:
        # rollback global insert si falla algo
        await repo.update_global(user_id, {"status": "error"})
        raise

    return {
        "message": "Usuario creado correctamente",
        "activation_token": activation_token
    }

async def list_users(current_user):

    if current_user["role"] not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    tenant_users = await repo.list_tenant_users(
        current_user["tenant_db"]
    )

    result = []

    for tu in tenant_users:

        # Buscar identidad en GLOBAL
        global_user = await repo.find_global_by_id(str(tu["_id"]))

        if not global_user:
            continue  # seguridad por si hay inconsistencia

        clinics = await repo.get_user_clinics(
            current_user["tenant_db"],
            tu["_id"]
        )

        result.append({
            "id": str(tu["_id"]),
            "email": global_user["email"],
            "role": tu["role"],
            "clinic_ids": [str(c["clinic_id"]) for c in clinics]
        })

    return result