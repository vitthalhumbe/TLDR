from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import TutorChatRequest
from services.groq_service import stream_tutor_response
from database import get_db

router = APIRouter(prefix="/tutor", tags=["tutor"])

@router.post("/chat")
async def tutor_chat(body: TutorChatRequest):
    db = get_db()

    content = db.table("processed_content").select("summary").eq("material_id", body.material_id).execute()
    if not content.data:
        raise HTTPException(404, "Material not found")

    summary = content.data[0]["summary"]
    messages = [{"role": m.role, "content": m.content} for m in body.messages]

    def event_stream():
        for chunk in stream_tutor_response(summary, messages):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
