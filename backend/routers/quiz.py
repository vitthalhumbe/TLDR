from fastapi import APIRouter, HTTPException
from models.schemas import QuizResultRequest
from database import get_db

router = APIRouter(prefix="/quiz", tags=["quiz"])

@router.post("/result")
async def save_quiz_result(body: QuizResultRequest):
    db = get_db()
    result = db.table("quiz_results").insert({
        "material_id": body.material_id,
        "score": body.score,
        "total": body.total,
        "answers": body.answers,
    }).execute()
    return {"id": result.data[0]["id"], "score": body.score, "total": body.total}

@router.get("/results/{material_id}")
async def get_quiz_results(material_id: str):
    db = get_db()
    results = db.table("quiz_results").select("*").eq("material_id", material_id).order("created_at", desc=True).execute()
    return {"results": results.data}
