from sqlalchemy.orm import Session
from fastapi import Depends
from config.database import get_db
from models import database_models


def channel_details(
    channel_id: int,
    db: Session = Depends(get_db),
):
    channel = (
        db.query(database_models.User)
        .filter(database_models.User.id == channel_id)
        .first()
    )
    return channel
