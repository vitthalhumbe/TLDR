import uuid
from supabase import Client


def save_material(db: Client, source_type: str, filename: str, data: dict) -> str:
    material_id = str(uuid.uuid4())

    db.table("materials").insert({
        "id":          material_id,
        "source_type": source_type,  
        "filename":    filename,
        "title":       data["summary"]["title"],
        "tldr":        data["summary"]["tldr"],
        "key_points":  data["summary"]["key_points"],
    }).execute()

    if data["flashcards"]:
        db.table("flashcards").insert([
            {
                "material_id": material_id,
                "front":       fc["front"],
                "back":        fc["back"],
            }
            for fc in data["flashcards"]
        ]).execute()

    if data["quizzes"]:
        db.table("quizzes").insert([
            {
                "material_id": material_id,
                "question":    q["question"],
                "type":        q["type"],
                "options":     q["options"],
                "correct":     q["correct"],
                "explanation": q["explanation"],
            }
            for q in data["quizzes"]
        ]).execute()

    return material_id