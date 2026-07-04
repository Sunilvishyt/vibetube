from app.constants.app_constants import AVATAR_DIR
from pathlib import Path


def get_avatar_filepath(user_id: int) -> Path:
    """Returns the expected Path object for a user's avatar."""
    filename = f"user_{user_id}.png"
    return AVATAR_DIR / filename


def get_avatar_url(user_id: int) -> str:
    """Returns the publicly accessible URL for the user's avatar."""
    filename = f"user_{user_id}.png"
    return f"/storage/avatars/{filename}"
