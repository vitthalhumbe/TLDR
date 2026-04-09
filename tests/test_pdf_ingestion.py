import io
import json
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

MOCK_GROQ_RESPONSE = {
    "summary": {
        "title": "Test Material",
        "key_points": ["Point 1", "Point 2"],
        "tldr": "This is a test summary.",
    },
    "flashcards": [
        {"front": "Q1", "back": "A1"},
        {"front": "Q2", "back": "A2"},
        {"front": "Q3", "back": "A3"},
        {"front": "Q4", "back": "A4"},
        {"front": "Q5", "back": "A5"},
    ],
    "quizzes": [
        {
            "question": "What is 2+2?",
            "type": "mcq",
            "options": ["A. 3", "B. 4", "C. 5", "D. 6"],
            "correct": ["B. 4"],
            "explanation": "Basic arithmetic.",
        },
        {
            "question": "Select all even numbers",
            "type": "msq",
            "options": ["A. 1", "B. 2", "C. 3", "D. 4"],
            "correct": ["B. 2", "D. 4"],
            "explanation": "2 and 4 are even.",
        },
        {
            "question": "Capital of France?",
            "type": "mcq",
            "options": ["A. Berlin", "B. Madrid", "C. Paris", "D. Rome"],
            "correct": ["C. Paris"],
            "explanation": "Paris is the capital.",
        },
    ],
}


def make_fake_pdf() -> bytes:
    """Minimal valid PDF bytes for testing."""
    return b"""%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 100 700 Td (Hello TLDR Test) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000000360 00000 n
trailer<</Size 6/Root 1 0 R>>
startxref
441
%%EOF"""


@patch("app.routers.process.save_material", return_value="test-uuid-1234")
@patch("app.routers.process.run_ingestion", return_value=MOCK_GROQ_RESPONSE)
@patch("app.routers.process.get_db", return_value=MagicMock())
@patch("app.routers.process.get_groq", return_value=MagicMock())
def test_process_pdf_success(mock_groq, mock_db, mock_ingest, mock_save):
    pdf_bytes = make_fake_pdf()
    response = client.post(
        "/process/pdf",
        files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["material_id"] == "test-uuid-1234"
    assert body["summary"]["title"] == "Test Material"
    assert len(body["flashcards"]) == 5
    assert len(body["quizzes"]) == 3


def test_process_pdf_wrong_type():
    response = client.post(
        "/process/pdf",
        files={"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")},
    )
    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]


def test_process_pdf_too_large():
    big = b"%PDF-1.4" + b"x" * (21 * 1024 * 1024)
    response = client.post(
        "/process/pdf",
        files={"file": ("big.pdf", io.BytesIO(big), "application/pdf")},
    )
    assert response.status_code == 413