from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

    groq_api_key: str
    supabase_url: str
    supabase_service_key: str

    environment: str = "development"
    cors_origin: str = "http://localhost:3000"

settings = Settings()
