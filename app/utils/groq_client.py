from groq import Groq 
from app.config import settings

INGESION_MODEL = "llama-3.3-70b-versatile"
CHAT_MODEL = "llama-3.1-8b-instant"

_client : Groq | None = None

def get_key() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.groq_api_key)
    return _client


