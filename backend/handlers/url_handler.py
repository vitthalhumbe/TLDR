import httpx

JINA_BASE = "https://r.jina.ai/"

def extract_text_from_url(url: str) -> str:
    jina_url = JINA_BASE + url
    
    with httpx.Client(timeout=30.0) as client:
        response = client.get(jina_url, headers={"Accept": "text/plain"})
        response.raise_for_status()
    text = response.text.strip()
    
    if not text:
        raise ValueError("Jina Reader returned empty content for this URL")
    
    return text
