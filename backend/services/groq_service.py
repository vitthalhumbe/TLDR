import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.1-8b-instant"

def chat_with_tutor(summary: str, messages: list[dict]) -> str:
    system_prompt = f"""You are an expert tutor who deeply understands the following study material. 
Answer student questions accurately and clearly, referencing specific concepts from the material.
If a question is outside the scope of the material, say so honestly.

STUDY MATERIAL:
{summary[:8000]}"""

    full_messages = [{"role": "system", "content": system_prompt}] + messages
    response = _client.chat.completions.create(
        model=MODEL,
        messages=full_messages,
        max_tokens=1024,
        temperature=0.7,
    )
    return response.choices[0].message.content

def stream_tutor_response(summary: str, messages: list[dict]):
    system_prompt = f"""You are an expert tutor who deeply understands the following study material.
Answer student questions accurately and clearly, referencing specific concepts from the material.
If a question is outside the scope of the material, say so honestly.

STUDY MATERIAL:
{summary[:8000]}"""

    full_messages = [{"role": "system", "content": system_prompt}] + messages
    stream = _client.chat.completions.create(
        model=MODEL,
        messages=full_messages,
        max_tokens=1024,
        temperature=0.7,
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta

def start_mock_interview(summary: str) -> str:
    system_prompt = f"""You are a strict interviewer testing a student on the following material.
Ask ONE question at a time. After each answer, give brief feedback (correct/partially correct/incorrect + why), then ask the next question.
After exactly 5 questions, output ONLY this JSON: {{"done": true, "score": X, "total": 5, "feedback": "overall feedback string"}}

MATERIAL:
{summary[:8000]}

Start by asking question 1."""

    response = _client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": system_prompt},
                  {"role": "user", "content": "Begin the interview."}],
        max_tokens=512,
        temperature=0.6,
    )
    return response.choices[0].message.content

def continue_mock_interview(summary: str, messages: list[dict]) -> str:
    system_prompt = f"""You are a strict interviewer testing a student on the following material.
Ask ONE question at a time. After each answer, give brief feedback (correct/partially correct/incorrect + why), then ask the next question.
After exactly 5 questions total, output ONLY this JSON on a new line: {{"done": true, "score": X, "total": 5, "feedback": "overall feedback string"}}
Keep track of how many questions you have asked so far from the conversation history.

MATERIAL:
{summary[:8000]}"""

    full_messages = [{"role": "system", "content": system_prompt}] + messages
    response = _client.chat.completions.create(
        model=MODEL,
        messages=full_messages,
        max_tokens=512,
        temperature=0.6,
    )
    return response.choices[0].message.content
