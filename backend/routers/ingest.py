from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schemas import IngestURLRequest
from handlers.pdf_handler import extract_text_from_pdf
from handlers.youtube_handler import extract_text_from_youtube
from handlers.url_handler import extract_text_from_url
from services.gemini_service import process_text_with_gemini  # now backed by Groq
from database import get_db

router = APIRouter(prefix="/ingest", tags=["ingest"])

def _store_material(source_type: str, source_ref: str, processed: dict) -> str:
    db = get_db()
    mat = db.table("materials").insert({
        "source_type": source_type,
        "source_ref": source_ref,
        "title": processed.get("title", "Untitled"),
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
async def ingest_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted")

    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:  # 20MB cap
        raise HTTPException(400, "PDF exceeds 20MB limit")

    try:
        text = extract_text_from_pdf(contents)
        processed = process_text_with_gemini(text)
        material_id = _store_material("pdf", file.filename, processed)
        return {"material_id": material_id, "title": processed["title"]}
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Processing failed: {str(e)}")

@router.post("/youtube")
async def ingest_youtube(body: IngestURLRequest):
    try:
        text = extract_text_from_youtube(body.url)
        processed = process_text_with_gemini(text)
        material_id = _store_material("youtube", body.url, processed)
        return {"material_id": material_id, "title": processed["title"]}
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Processing failed: {str(e)}")

@router.post("/url")
async def ingest_url(body: IngestURLRequest):
    try:
        text = extract_text_from_url(body.url)
        processed = process_text_with_gemini(text)
        material_id = _store_material("url", body.url, processed)
        return {"material_id": material_id, "title": processed["title"]}
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Processing failed: {str(e)}")