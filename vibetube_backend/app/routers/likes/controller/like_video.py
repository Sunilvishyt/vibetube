from schemas import pydantic_models
from sqlalchemy.orm import Session
from fastapi import Depends
from models import database_models
from config.jwt_config import get_current_user_id
from config.database import get_db


def like_video(
    data: pydantic_models.LikeToggle,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):

    existing = (
        db.query(database_models.Like)
        .filter(
            database_models.Like.video_id == data.video_id,
            database_models.Like.user_id == current_user_id,
        )
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Removed"}

    new_like = database_models.Like(
        video_id=data.video_id, user_id=current_user_id, type=data.type
    )

    db.add(new_like)
    db.commit()
    return {"message": "Added"}
