from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from app.models import database_models
from app.config.database import get_db


def get_single_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(database_models.Video).filter_by(id=video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
