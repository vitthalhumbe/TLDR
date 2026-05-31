import json
from fastapi import APIRouter, HTTPException
from models.schemas import MockStartRequest, MockAnswerRequest
from services.groq_service import start_mock_interview, continue_mock_interview
from database import get_db

router = APIRouter(prefix="/mock", tags=["mock"])

def _get_summary(material_id: str) -> str:
    db = get_db()
    content = db.table("processed_content").select("summary").eq("material_id", material_id).execute()
    if not content.data:
        raise HTTPException(404, "Material not found")
    return content.data[0]["summary"]

@router.post("/start")
async def start_session(body: MockStartRequest):
    db = get_db()
    summary = _get_summary(body.material_id)
    first_question = start_mock_interview(summary)

    session = db.table("mock_sessions").insert({
        "material_id": body.material_id,
        "messages": [{"role": "assistant", "content": first_question}],
    }).execute()

    return {
        "session_id": session.data[0]["id"],
        "message": first_question,
    }

@router.post("/answer")
async def submit_answer(body: MockAnswerRequest):
    db = get_db()
    summary = _get_summary(body.material_id)

    messages = [{"role": m.role, "content": m.content} for m in body.messages]
    messages.append({"role": "user", "content": body.answer})

    response = continue_mock_interview(summary, messages)

    # Check if interview is done
    done_data = None
    lines = response.strip().split("\n")
    for line in lines:
        line = line.strip()
        if line.startswith("{") and "done" in line:
            try:
                done_data = json.loads(line)
                break
            except json.JSONDecodeError:
                pass

    updated_messages = messages + [{"role": "assistant", "content": response}]
    update_payload = {"messages": updated_messages}

    if done_data and done_data.get("done"):
        update_payload["completed"] = True
        update_payload["score"] = done_data.get("score", 0)
        update_payload["total"] = done_data.get("total", 5)
        update_payload["feedback"] = done_data.get("feedback", "")

    db.table("mock_sessions").update(update_payload).eq("id", body.session_id).execute()

    return {
        "message": response,
        "done": done_data is not None and done_data.get("done", False),
        "result": done_data,
    }
