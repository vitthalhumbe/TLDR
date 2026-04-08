from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import process, tutor, interview
from app.utils.db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    #await init_db()
    yield
    
app = FastAPI(
    title="TL;DR API endpoint",
    description="AI-Powered study companion - TLDR",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(process.router, prefix="/process", tags=["Ingestion"])
app.include_router(tutor.router, prefix="/tutor", tags=["Tutor"])
app.include_router(interview.router, prefix="/itnerview", tags=["Interview"])


@app.get("/health")
async def health():
    return {"status": "ok", "project": "TLDR"}

