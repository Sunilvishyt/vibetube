from fastapi import Depends, status, HTTPException
from app.schemas import pydantic_models
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.config.jwt_config import get_current_user_id
from app.models import database_models
from sqlalchemy import update, func
from sqlalchemy.exc import IntegrityError


def update_view(
    data: pydantic_models.ViewIncrement,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    existing = (
        db.query(database_models.View)
        .filter(
            database_models.View.video_id == data.video_id,
            database_models.View.user_id == current_user_id,
        )
        .first()
    )

    if existing:
        existing.created_at = func.now()
        db.commit()
        return {"msg": "View timestamp updated."}

    else:
        db.execute(
            update(database_models.Video)
            .where(database_models.Video.id == data.video_id)
            .values(views=database_models.Video.views + 1)
        )

        new_view = database_models.View(
            user_id=current_user_id,
            video_id=data.video_id,
        )
        db.add(new_view)

        try:
            db.commit()
            return {
                "msg": "New view recorded and count incremented."
            }, status.HTTP_201_CREATED

        except IntegrityError:
            db.rollback()  # Rollback the failed insert attempt

            existing_view_after_race = (
                db.query(database_models.View)
                .filter(
                    database_models.View.video_id == data.video_id,
                    database_models.View.user_id == current_user_id,
                )
                .first()
            )

            # Update its timestamp
            if existing_view_after_race:
                existing_view_after_race.created_at = func.now()
                db.commit()
                return {
                    "msg": "Race condition detected and fixed: View timestamp updated."
                }
            else:
                # Should not happen, but good practice
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database error during race condition handling.",
                )
