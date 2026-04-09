# import json
# import jsonschema
# from groq import Groq

# from app.utils.groq_client import INGESTION_MODEL

# INGESTION_SCHEMA = {
#     "type": "object",
#     "required": ["summary", "flashcards", "quizzes"],
#     "properties": {
#         "summary": {
#             "type": "object",
#             "required": ["title", "key_points", "tldr"],
#             "properties": {
#                 "title":      {"type": "string"},
#                 "key_points": {"type": "array", "items": {"type": "string"}},
#                 "tldr":       {"type": "string"},
#             },
#         },
#         "flashcards": {
#             "type": "array",
#             "items": {
#                 "type": "object",
#                 "required": ["front", "back"],
#                 "properties": {
#                     "front": {"type": "string"},
#                     "back":  {"type": "string"},
#                 },
#             },
#         },
#         "quizzes": {
#             "type": "array",
#             "items": {
#                 "type": "object",
#                 "required": ["question", "type", "options", "correct", "explanation"],
#                 "properties": {
#                     "question":    {"type": "string"},
#                     "type":        {"type": "string", "enum": ["mcq", "msq"]},
#                     "options":     {"type": "array", "items": {"type": "string"}},
#                     "correct":     {"type": "array", "items": {"type": "string"}},
#                     "explanation": {"type": "string"},
#                 },
#             },
#         },
#     },
# }

# SYSTEM_PROMPT = """You are a JSON-only responder. Output nothing but valid JSON. No explanation, no markdown, no backticks.

# You will receive educational text. Produce a JSON object with this exact structure:
# {
#   "summary": {
#     "title": "<concise title>",
#     "key_points": ["<point 1>", "<point 2>", "..."],
#     "tldr": "<2-3 sentence summary>"
#   },
#   "flashcards": [
#     { "front": "<concept or question>", "back": "<answer or explanation>" }
#   ],
#   "quizzes": [
#     {
#       "question": "<question text>",
#       "type": "mcq",
#       "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
#       "correct": ["A. ..."],
#       "explanation": "<why this is correct>"
#     }
#   ]
# }

# Rules TO BE FOLLOWED STRICTLY:
# - Maximum 10 key points
# - Minimum 5 flashcards, 
# - Minimum 5 quiz questions
# - Mix mcq (single correct) and msq (multiple correct) types
# - correct array must contain the full option string(s), not just the letter
# - Output ONLY the JSON object. Nothing else."""

# MAX_CHARS_PER_CHUNK = 4000  # 80_000
# MAX_RETRIES = 3


# def _call_groq(client: Groq, text: str) -> dict:
#     response = client.chat.completions.create(
#         model=INGESTION_MODEL,
#         messages=[
#             {"role": "system", "content": SYSTEM_PROMPT},
#             {"role": "user",   "content": f"Generate study material from this text:\n\n{text}"},
#         ],
#         temperature=0.3, 
#         max_tokens=4096,
#     )
#     raw = response.choices[0].message.content.strip()
#     if raw.startswith("```"):
#         raw = raw.split("```")[1]
#         if raw.startswith("json"):
#             raw = raw[4:]

#     parsed = json.loads(raw)                    
#     jsonschema.validate(parsed, INGESTION_SCHEMA) 
#     return parsed


# def _merge_chunks(chunks: list[dict]) -> dict:
#     merged = {
#         "summary": chunks[0]["summary"],
#         "flashcards": [],
#         "quizzes": [],
#     }
#     all_points = []
#     for chunk in chunks:
#         all_points.extend(chunk["summary"]["key_points"])
#         merged["flashcards"].extend(chunk["flashcards"])
#         merged["quizzes"].extend(chunk["quizzes"])

#     merged["summary"]["key_points"] = all_points
#     return merged


# def run_ingestion(client: Groq, text: str) -> dict:
#     chunks_text = [
#         text[i : i + MAX_CHARS_PER_CHUNK]
#         for i in range(0, len(text), MAX_CHARS_PER_CHUNK)
#     ]

#     results = []
#     for chunk in chunks_text:
#         last_error = None
#         for attempt in range(1, MAX_RETRIES + 1):
#             try:
#                 result = _call_groq(client, chunk)
#                 results.append(result)
#                 break
#             except (json.JSONDecodeError, jsonschema.ValidationError, Exception) as e:
#                 last_error = e
#                 if attempt == MAX_RETRIES:
#                     raise RuntimeError(
#                         f"Groq ingestion failed after {MAX_RETRIES} attempts: {last_error}"
#                     )

#     return _merge_chunks(results) if len(results) > 1 else results[0]

import json
import jsonschema
from groq import Groq

from app.utils.groq_client import INGESTION_MODEL

# -------------------------
# SCHEMA (FINAL OUTPUT)
# -------------------------
FINAL_SCHEMA = {
    "type": "object",
    "required": ["summary", "flashcards", "quizzes"],
    "properties": {
        "summary": {
            "type": "object",
            "required": ["title", "key_points", "tldr"],
            "properties": {
                "title": {"type": "string"},
                "key_points": {"type": "array", "items": {"type": "string"}},
                "tldr": {"type": "string"},
            },
        },
        "flashcards": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["front", "back"],
                "properties": {
                    "front": {"type": "string"},
                    "back": {"type": "string"},
                },
            },
        },
        "quizzes": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["question", "type", "options", "correct", "explanation"],
                "properties": {
                    "question": {"type": "string"},
                    "type": {"type": "string", "enum": ["mcq", "msq"]},
                    "options": {"type": "array", "items": {"type": "string"}},
                    "correct": {"type": "array", "items": {"type": "string"}},
                    "explanation": {"type": "string"},
                },
            },
        },
    },
}

# -------------------------
# PROMPTS
# -------------------------

# Stage 1 → only extract key points
CHUNK_PROMPT = """Extract key learning points from the given text.

Rules:
- Maximum 10 key points
- Each point must be concise
- No duplication
- Output ONLY JSON

Format:
{
  "key_points": ["point1", "point2", "..."]
}
"""

# Stage 2 → generate final output
FINAL_PROMPT = """You are a JSON-only responder.

Using the provided key points, generate structured study material.

Rules:
- Max 10 key points
- 5–10 flashcards
- 3–5 quizzes
- Avoid repetition
- Output ONLY JSON

Format:
{
  "summary": {
    "title": "...",
    "key_points": [...],
    "tldr": "..."
  },
  "flashcards": [...],
  "quizzes": [...]
}
"""

MAX_CHARS_PER_CHUNK = 3000
MAX_RETRIES = 2


# -------------------------
# HELPERS
# -------------------------

def _call(client: Groq, system_prompt: str, user_text: str) -> dict:
    response = client.chat.completions.create(
        model=INGESTION_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_text},
        ],
        temperature=0.3,
        max_tokens=2048,
    )

    raw = response.choices[0].message.content.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    return json.loads(raw)


def _dedupe_list(items):
    seen = set()
    result = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


# -------------------------
# STAGE 1 → CHUNK PROCESSING
# -------------------------

def _process_chunks(client: Groq, text: str):
    chunks = [
        text[i:i + MAX_CHARS_PER_CHUNK]
        for i in range(0, len(text), MAX_CHARS_PER_CHUNK)
    ]

    all_points = []

    for chunk in chunks:
        for _ in range(MAX_RETRIES):
            try:
                res = _call(client, CHUNK_PROMPT, chunk)
                all_points.extend(res["key_points"])
                break
            except Exception:
                continue

    return _dedupe_list(all_points)[:15]  # cap


# -------------------------
# STAGE 2 → FINAL GENERATION
# -------------------------

def _final_generation(client: Groq, key_points: list[str]) -> dict:
    combined = "\n".join(key_points)

    result = _call(
        client,
        FINAL_PROMPT,
        f"Generate study material from these key points:\n{combined}"
    )

    jsonschema.validate(result, FINAL_SCHEMA)
    return result


# -------------------------
# MAIN PIPELINE
# -------------------------

def run_ingestion(client: Groq, text: str) -> dict:
    key_points = _process_chunks(client, text)
    return _final_generation(client, key_points)