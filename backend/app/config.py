import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/server_monitoring")
    JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4200")
    SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
    SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
    JWT_ALGORITHM = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

settings = Settings()

