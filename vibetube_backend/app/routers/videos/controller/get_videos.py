from app.models import database_models
from fastapi import Query, Depends, HTTPException
from typing import Optional
from app.constants.app_constants import DEFAULT_VIDEO_LIMIT
from sqlalchemy.orm import Session, joinedload
from app.config.database import get_db
from app.config.jwt_config import get_current_user_id
from sqlalchemy import func
from datetime import datetime


def get_videos(
    vid_query: str = Query("random", min_length=1),
    limit: int = Query(DEFAULT_VIDEO_LIMIT, ge=1, le=50),  # Max 50 per request
    offset: int = Query(0, ge=0),
    exclude_ids: Optional[str] = Query(None),
    channel_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    """
    Fetches videos with pagination using limit and offset.
    """
    VALID_CATEGORIES = {
        "music",
        "movies",
        "gaming",
        "anime",
        "education",
        "entertainment",
        "tech",
        "news",
        "vlogs",
        "trending",
        "liked",
        "history",
        "ChannelVideos",
    }

    if vid_query != "random" and vid_query not in VALID_CATEGORIES:
        raise HTTPException(400, "Invalid category")

    # Base query
    basequery = db.query(database_models.Video).options(
        joinedload(database_models.Video.owner)
    )
    exclude_ids_list = []

    if vid_query == "random":
        if exclude_ids:
            try:
                exclude_ids_list = [int(x) for x in exclude_ids.split(",") if x.strip()]
            except ValueError:
                raise HTTPException(400, "exclude_ids must be integers")

            if exclude_ids_list:
                basequery = basequery.filter(
                    database_models.Video.id.notin_(exclude_ids_list)
                )

        videos = basequery.order_by(func.random()).limit(limit).all()

    elif vid_query == "liked":
        videos = (
            basequery.join(
                database_models.Like,
                database_models.Like.video_id == database_models.Video.id,
            )
            .filter(database_models.Like.user_id == current_user_id)
            .order_by(database_models.Video.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    elif vid_query == "history":
        videos = (
            basequery.join(
                database_models.View,
                database_models.View.video_id == database_models.Video.id,
            )
            .filter(database_models.View.user_id == current_user_id)
            .order_by(database_models.View.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    elif vid_query == "trending":
        current_time = datetime.utcnow()

        # compute age in hours
        age_hours = func.greatest(
            func.extract("epoch", current_time - database_models.Video.created_at)
            / 3600.0,
            0.0,
        )

        # trend score formula
        trend_score = database_models.Video.views / func.pow(age_hours + 2, 1.2)

        videos = (
            basequery.order_by(trend_score.desc()).offset(offset).limit(limit).all()
        )
    elif vid_query == "ChannelVideos":
        videos = (
            basequery.filter(database_models.Video.user_id == channel_id)
            .order_by(database_models.Video.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
    else:
        videos = (
            basequery.filter(database_models.Video.category == vid_query)
            .order_by(database_models.Video.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
    return videos
