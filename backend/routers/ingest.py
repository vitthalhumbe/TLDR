from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Header
from models.schemas import IngestURLRequest
from handlers.pdf_handler import extract_text_from_pdf
from handlers.youtube_handler import extract_text_from_youtube
from handlers.url_handler import extract_text_from_url
from services.gemini_service import process_text_with_gemini
from database import get_db
from auth import get_current_user, check_rate_limit

router = APIRouter(prefix="/ingest", tags=["ingest"])

def _store_material(source_type: str, source_ref: str, processed: dict, user_id: str) -> str:
    db = get_db()
    mat = db.table("materials").insert({
        "source_type": source_type,
        "source_ref": source_ref,
        "title": processed.get("title", "Untitled"),
        "user_id": user_id,
    }).execute()
    material_id = mat.data[0]["id"]

    db.table("processed_content").insert({
        "material_id": material_id,
        "summary": processed["summary"],
        "flashcards": processed["flashcards"],
        "quizzes": processed["quizzes"],
    }).execute()

    return material_id

@router.post("/pdf")
async def ingest_pdf(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    db = get_db()
    check_rate_limit(user_id, db)

    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted")

    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:
        raise HTTPException(400, "PDF exceeds 20MB limit")

    try:
        text = extract_text_from_pdf(contents)
        processed = process_text_with_gemini(text)
        material_id = _store_material("pdf", file.filename, processed, user_id)
        return {"material_id": material_id, "title": processed["title"]}
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Processing failed: {str(e)}")

@router.post("/youtube")
async def ingest_youtube(
    body: IngestURLRequest,
    user_id: str = Depends(get_current_user),
):
    db = get_db()
    check_rate_limit(user_id, db)

    try:
        text = extract_text_from_youtube(body.url)
        processed = process_text_with_gemini(text)
        material_id = _store_material("youtube", body.url, processed, user_id)
        return {"material_id": material_id, "title": processed["title"]}
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Processing failed: {str(e)}")

@router.post("/url")
async def ingest_url(
    body: IngestURLRequest,
    user_id: str = Depends(get_current_user),
):
    db = get_db()
    check_rate_limit(user_id, db)

    try:
        text = extract_text_from_url(body.url)
        processed = process_text_with_gemini(text)
        material_id = _store_material("url", body.url, processed, user_id)
        return {"material_id": material_id, "title": processed["title"]}
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Processing failed: {str(e)}")