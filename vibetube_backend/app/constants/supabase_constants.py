from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = "vibetube bucket"

if not SUPABASE_KEY or not SUPABASE_URL:
    raise ValueError("Supabase environment variables are missing")
