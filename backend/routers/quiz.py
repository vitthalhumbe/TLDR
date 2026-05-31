from fastapi import APIRouter, HTTPException, Depends
from models.schemas import QuizResultRequest
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/quiz", tags=["quiz"])

@router.post("/result")
async def save_quiz_result(body: QuizResultRequest, user_id: str = Depends(get_current_user)):
    db = get_db()

    mat = db.table("materials").select("user_id").eq("id", body.material_id).execute()
    if not mat.data:
        raise HTTPException(404, "Material not found")
    if mat.data[0].get("user_id") != user_id:
        raise HTTPException(403, "Access denied")

    result = db.table("quiz_results").insert({
        "material_id": body.material_id,
        "score": body.score,
        "total": body.total,
        "answers": body.answers,
    }).execute()
    return {"id": result.data[0]["id"], "score": body.score, "total": body.total}

@router.get("/results/{material_id}")
async def get_quiz_results(material_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()

    mat = db.table("materials").select("user_id").eq("id", material_id).execute()
    if not mat.data:
        raise HTTPException(404, "Material not found")
    if mat.data[0].get("user_id") != user_id:
        raise HTTPException(403, "Access denied")

    results = db.table("quiz_results").select("*").eq("material_id", material_id).order("created_at", desc=True).execute()
    return {"results": results.data}