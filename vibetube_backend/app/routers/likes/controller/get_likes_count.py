from fastapi import Depends
from sqlalchemy.orm import Session
from app.models import database_models
from app.config.jwt_config import get_current_user_id
from app.config.database import get_db


def get_likes_count(
    video_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    count = (
        db.query(database_models.Like)
        .filter(database_models.Like.video_id == video_id)
        .count()
    )
    user_liked = (
        db.query(database_models.Like)
        .filter(
            database_models.Like.video_id == video_id,
            database_models.Like.user_id == current_user_id,
        )
        .first()
    )

    if user_liked:
        return {"liked": "true", "likes": count}
    else:
        return {"liked": "false", "likes": count}
