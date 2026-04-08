from pydantic_settings import BaseSettings 

class Settings(BaseSettings):
    groq_api_key : str = "dummy"
    supabase_url : str = "dummy"
    supabase_service_key : str = "dummy"

    environment : str = "development"
    cors_origin : str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
