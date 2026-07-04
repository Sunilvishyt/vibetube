from app.models import database_models
from sqlalchemy.orm import Session
from fastapi import Depends
from sqlalchemy.orm import joinedload
from app.config.database import get_db


def get_comments(video_id: int, db: Session = Depends(get_db)):
    comments = (
        db.query(database_models.Comment)
        .join(database_models.Comment.user)
        .options(joinedload(database_models.Comment.user))
        .filter(database_models.Comment.video_id == video_id)
        .order_by(database_models.Comment.created_at.desc())
        .all()
    )
    return comments
