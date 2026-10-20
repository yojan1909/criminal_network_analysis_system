"""
Nexus Intelligence Command Center — Configuration Module
Loads configuration from environment variables and .env file.
"""

import os
from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Try to load .env if python-dotenv or simple reader is available
def load_env_file(filepath: Path):
    if not filepath.exists():
        return
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip("\"'").strip()
                if key and key not in os.environ:
                    os.environ[key] = val

load_env_file(BASE_DIR / ".env")

class Config:
    # Database
    DB_PATH = os.environ.get("DB_PATH", str(BASE_DIR / "nexus.db"))

    # AI Provider: 'auto', 'groq', 'gemini', 'ollama', 'openai', 'heuristic'
    AI_PROVIDER = os.environ.get("AI_PROVIDER", "auto").lower()

    # API Keys
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "") or os.environ.get("GOOGLE_API_KEY", "")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

    # Endpoints & Models
    OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2")

    GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

    # NLP thresholds
    AUTO_ACCEPT_THRESHOLD = float(os.environ.get("AUTO_ACCEPT_THRESHOLD", "0.85"))

    @classmethod
    def get_active_provider(cls) -> str:
        """Determine which provider to use based on settings and available keys."""
        if cls.AI_PROVIDER != "auto":
            return cls.AI_PROVIDER

        if cls.GROQ_API_KEY:
            return "groq"
        elif cls.GEMINI_API_KEY:
            return "gemini"
        elif cls.OPENAI_API_KEY:
            return "openai"
        return "heuristic"

config = Config()
