from sqlalchemy.orm import Session
from fastapi import Depends
from config.database import get_db
from config.jwt_config import get_current_user_id
from models import database_models


def get_subscribers(
    channel_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):

    subscribers_count = (
        db.query(database_models.Subscription)
        .filter(database_models.Subscription.channel_id == channel_id)
        .count()
    )

    subscribed = (
        db.query(database_models.Subscription)
        .filter(
            database_models.Subscription.channel_id == channel_id,
            database_models.Subscription.user_id == current_user_id,
        )
        .first()
    )
    owner_watching = channel_id == current_user_id
    if subscribed:
        return {
            "subscribed": "true",
            "subscribers": subscribers_count,
            "owner_watching": str(owner_watching),
        }
    else:
        return {
            "subscribed": "false",
            "subscribers": subscribers_count,
            "owner_watching": str(owner_watching),
        }
