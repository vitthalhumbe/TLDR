import os
from fastapi import HTTPException, Header
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta

load_dotenv()

_supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def get_current_user(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token")

    token = authorization.removeprefix("Bearer ").strip()

    try:
        response = _supabase.auth.get_user(token)
        user = response.user
        if not user:
            raise HTTPException(401, "Invalid token")
        return user.id
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

def check_rate_limit(user_id: str, db) -> None:
    window_start = (datetime.now(timezone.utc) - timedelta(days=3)).isoformat()

    result = db.table("materials") \
        .select("id", count="exact") \
        .eq("user_id", user_id) \
        .gte("created_at", window_start) \
        .execute()

    count = result.count if result.count is not None else len(result.data)
    if count >= 1:
        raise HTTPException(429, "Limit reached: 1 upload per 3 days")