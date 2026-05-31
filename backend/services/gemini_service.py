import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
INGEST_MODEL = "llama-3.3-70b-versatile"

PROMPT_TEMPLATE = """You are a study assistant. Analyze the text below and return ONLY valid JSON — no markdown fences, no preamble, nothing else.

Required JSON structure:
{{
  "title": "short descriptive title for this material (max 8 words)",
  "summary": "comprehensive 3-5 paragraph summary covering all key concepts",
  "flashcards": [
    {{"front": "question or term", "back": "answer or definition"}}
  ],
  "quizzes": [
    {{
      "question": "question text",
      "type": "mcq",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": "option A",
      "explanation": "why this answer is correct"
    }},
    {{
      "question": "question text",
      "type": "msq",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": ["option A", "option C"],
      "explanation": "why these answers are correct"
    }}
  ]
}}

Rules:
- flashcards: exactly 12-15 items
- quizzes: exactly 8-10 items, mix of mcq and msq (at least 2 msq)
- mcq answer is a string, msq answer is an array of strings
- all answers must be from the options list verbatim

TEXT:
{text}"""

def _validate(data: dict) -> bool:
    required = {"title", "summary", "flashcards", "quizzes"}
    if not required.issubset(data.keys()):
        return False
    if not isinstance(data["flashcards"], list) or len(data["flashcards"]) < 5:
        return False
    if not isinstance(data["quizzes"], list) or len(data["quizzes"]) < 3:
        return False
    for q in data["quizzes"]:
        if q.get("type") not in ("mcq", "msq"):
            return False
    return True

def _strip_fences(raw: str) -> str:
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return raw.strip()

def process_text_with_gemini(text: str, retries: int = 3) -> dict:
    # llama-3.3-70b-versatile has 128k context; truncate conservatively at 100k chars
    truncated = text[:16000] if len(text) > 16000 else text
    prompt = PROMPT_TEMPLATE.format(text=truncated)

    last_error = None
    for attempt in range(retries):
        try:
            response = _client.chat.completions.create(
                model=INGEST_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=4096,
                temperature=0.3,  # low temp for structured output
            )
            raw = _strip_fences(response.choices[0].message.content.strip())
            data = json.loads(raw)
            if _validate(data):
                return data
            last_error = ValueError(f"Schema validation failed on attempt {attempt + 1}")
        except json.JSONDecodeError as e:
            last_error = e
        except Exception as e:
            last_error = e

    raise ValueError(f"Groq ingestion failed after {retries} attempts: {last_error}")