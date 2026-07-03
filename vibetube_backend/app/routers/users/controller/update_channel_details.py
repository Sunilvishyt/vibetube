from fastapi import Form, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from config.jwt_config import get_current_user_id
from utils.avatar_utils import get_avatar_filepath, get_avatar_url
from models import database_models
from PIL import Image
from io import BytesIO
from config.database import get_db


async def update_channel_details(
    username: str = Form(...),
    description: str = Form(None),
    profile_image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    user = db.query(database_models.User).filter_by(id=current_user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    avatar_path = get_avatar_filepath(current_user_id)

    if profile_image:
        if not profile_image.filename.lower().endswith(
            (".png", ".jpg", ".jpeg", ".webp")
        ):
            raise HTTPException(400, "Invalid image type")

        # delete old avatar
        if avatar_path.exists():
            avatar_path.unlink()

        contents = await profile_image.read()
        img = Image.open(BytesIO(contents)).convert("RGBA")

        # resize to standard
        img = img.resize((128, 128))

        img.save(avatar_path, "PNG")

        user.profile_image = f"http://127.0.0.1:8000{get_avatar_url(current_user_id)}"

    user.username = username
    user.channel_description = description
    db.commit()
    pass
