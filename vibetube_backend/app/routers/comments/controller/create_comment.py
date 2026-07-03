from schemas import pydantic_models
from fastapi import Depends
from sqlalchemy.orm import Session
from config.jwt_config import get_current_user_id
from models import database_models
from config.database import get_db


def create_comment(
    data: pydantic_models.CommentCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):

    username = db.query(database_models.User).filter_by(id=current_user_id).first()
    new_comment = database_models.Comment(
        video_id=data.video_id, user_id=current_user_id, text=data.text
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment
