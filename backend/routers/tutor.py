from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from models.schemas import TutorChatRequest
from services.groq_service import stream_tutor_response
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/tutor", tags=["tutor"])

@router.post("/chat")
async def tutor_chat(body: TutorChatRequest, user_id: str = Depends(get_current_user)):
    db = get_db()

    mat = db.table("materials").select("user_id").eq("id", body.material_id).execute()
    if not mat.data:
        raise HTTPException(404, "Material not found")
    if mat.data[0].get("user_id") != user_id:
        raise HTTPException(403, "Access denied")

    content = db.table("processed_content").select("summary").eq("material_id", body.material_id).execute()
    if not content.data:
        raise HTTPException(404, "Processed content not found")

    summary = content.data[0]["summary"]
    messages = [{"role": m.role, "content": m.content} for m in body.messages]

    def event_stream():
        for chunk in stream_tutor_response(summary, messages):
            # replace newlines so SSE doesn't break them
            encoded = chunk.replace("\n", "{{NL}}")
            yield f"data: {encoded}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")