from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ingest, material, quiz, tutor, mock

app = FastAPI(title="TLDR API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(material.router)
app.include_router(quiz.router)
app.include_router(tutor.router)
app.include_router(mock.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
