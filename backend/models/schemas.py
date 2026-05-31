from pydantic import BaseModel
from typing import Any

class IngestURLRequest(BaseModel):
    url: str

class TutorMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class TutorChatRequest(BaseModel):
    material_id: str
    messages: list[TutorMessage]

class QuizResultRequest(BaseModel):
    material_id: str
    score: int
    total: int
    answers: list[Any]

class MockStartRequest(BaseModel):
    material_id: str

class MockAnswerRequest(BaseModel):
    session_id: str
    material_id: str
    answer: str
    messages: list[TutorMessage]
