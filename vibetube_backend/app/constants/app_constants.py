import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")
AVATAR_DIR = Path("storage/avatars")
VIDEO_DIR = Path("storage/videos")
THUMB_DIR = Path("storage/thumbnails")
THUMB_WIDTH = 320  # Standard thumbnail width
THUMB_HEIGHT = 180  # Standard thumbnail height
THUMB_QUALITY = 85  # JPEG quality for compression
DEFAULT_VIDEO_LIMIT = 12

os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(THUMB_DIR, exist_ok=True)
os.makedirs(AVATAR_DIR, exist_ok=True)
