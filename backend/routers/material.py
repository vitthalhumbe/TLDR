from fastapi import APIRouter, HTTPException, Depends
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/material", tags=["material"])

@router.get("/")
async def list_materials(user_id: str = Depends(get_current_user)):
    db = get_db()
    result = db.table("materials") \
        .select("id, title, source_type, created_at") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(50) \
        .execute()
    return {"materials": result.data}

@router.get("/{material_id}")
async def get_material(material_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()

    mat = db.table("materials").select("*").eq("id", material_id).execute()
    if not mat.data:
        raise HTTPException(404, "Material not found")

    if mat.data[0].get("user_id") != user_id:
        raise HTTPException(403, "Access denied")

    content = db.table("processed_content").select("*").eq("material_id", material_id).execute()
    if not content.data:
        raise HTTPException(404, "Processed content not found")

    return {
        "material": mat.data[0],
        "content": content.data[0],
    }