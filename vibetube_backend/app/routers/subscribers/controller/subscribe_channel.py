from app.schemas import pydantic_models
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from app.models import database_models
from app.config.database import get_db
from app.config.jwt_config import get_current_user_id


def subscribe_to_channel(
    data: pydantic_models.SubscribeToggle,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    if data.user_id == current_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot subscribe to yourself",
        )
    existing = (
        db.query(database_models.Subscription)
        .filter(
            database_models.Subscription.channel_id == data.user_id,
            database_models.Subscription.user_id == current_user_id,
        )
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Removed"}

    new_subscribe = database_models.Subscription(
        channel_id=data.user_id,
        user_id=current_user_id,
    )

    db.add(new_subscribe)
    db.commit()
    return {"message": "Added"}
