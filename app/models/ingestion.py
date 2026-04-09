from pydantic import BaseModel


class Flashcard(BaseModel):
    front: str
    back: str


class Quiz(BaseModel):
    question: str
    type: str     
    options: list[str]
    correct: list[str]
    explanation: str


class Summary(BaseModel):
    title: str
    key_points: list[str]
    tldr: str


class IngestionResult(BaseModel):
    material_id: str
    summary: Summary
    flashcards: list[Flashcard]
    quizzes: list[Quiz]