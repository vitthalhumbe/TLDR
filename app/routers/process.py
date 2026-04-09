from fastapi import APIRouter
from fastapi import UploadFile, File, HTTPException
from app.models.ingestion import IngestionResult
from app.services.pdf import extract_text_from_pdf
from app.services.ingestion import run_ingestion
from app.services.storage import save_material
from app.utils.groq_client import get_groq
from app.utils.db import get_db
router = APIRouter()

@router.get("/")
def test():
    return {"msg": "process working"}


ALLOWED_MIME_TYPES = {"application/pdf"}
MAX_FILE_SIZE_MB = 20
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


@router.post("/pdf", response_model=IngestionResult)
async def process_pdf(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size is {MAX_FILE_SIZE_MB}MB.",
        )
    try:
        text = extract_text_from_pdf(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    try:
        data = run_ingestion(get_groq(), text)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    try:
        material_id = save_material(
            db=get_db(),
            source_type="pdf",
            filename=file.filename or "upload.pdf",
            data=data,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB write failed: {e}")

    return IngestionResult(
        material_id=material_id,
        summary=data["summary"],
        flashcards=data["flashcards"],
        quizzes=data["quizzes"],
    )