from fastapi import APIRouter, HTTPException
from database import get_db

router = APIRouter(prefix="/material", tags=["material"])

@router.get("/{material_id}")
async def get_material(material_id: str):
    db = get_db()

    mat = db.table("materials").select("*").eq("id", material_id).execute()
    if not mat.data:
        raise HTTPException(404, "Material not found")

    content = db.table("processed_content").select("*").eq("material_id", material_id).execute()
    if not content.data:
        raise HTTPException(404, "Processed content not found")

    return {
        "material": mat.data[0],
        "content": content.data[0],
    }

@router.get("/")
async def list_materials():
    db = get_db()
    result = db.table("materials").select("id, title, source_type, created_at").order("created_at", desc=True).limit(50).execute()
    return {"materials": result.data}
