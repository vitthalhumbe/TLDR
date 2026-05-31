import re
from youtube_transcript_api import YouTubeTranscriptApi

def _extract_video_id(url: str) -> str:
    patterns = [
        r"(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})",
        r"(?:embed/)([A-Za-z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError(f"Could not extract video ID from URL: {url}")

def extract_text_from_youtube(url: str) -> str:
    video_id = _extract_video_id(url)
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
    text = " ".join(entry["text"] for entry in transcript_list)
    if not text.strip():
        raise ValueError("Transcript is empty for this video")
    return text.strip()
