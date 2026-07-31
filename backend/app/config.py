import os
from dotenv import load_dotenv

# Load .env file
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agrisense.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "agrisense_secret_key_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

settings = Settings()
