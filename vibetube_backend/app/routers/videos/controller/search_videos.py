from fastapi import Query, Depends
from app.config.database import get_db
from app.models import database_models
from sqlalchemy.orm import joinedload, Session
from sqlalchemy import or_, case


def search_videos(
    query: str = Query(..., min_length=1),
    offset: int = Query(0, ge=0),
    limit: int = Query(12, le=100),
    db: Session = Depends(get_db),
):
    like_query = f"%{query}%"

    videos = (
        db.query(database_models.Video)
        .join(database_models.Video.owner)
        .options(joinedload(database_models.Video.owner))
        .filter(
            or_(
                database_models.Video.title.ilike(like_query),
                database_models.Video.description.ilike(like_query),
                database_models.User.username.ilike(like_query),
            )
        )
        .order_by(
            case(
                (database_models.Video.title.ilike(like_query), 1),
                (database_models.User.username.ilike(like_query), 2),
                else_=3,
            ),
            database_models.Video.views.desc(),
        )
        .offset(offset)
        .limit(limit)
        .all()
    )

    return [
        {
            "id": video.id,
            "title": video.title,
            "thumbnail_url": video.thumbnail_url,
            "duration": video.duration,
            "video_url": video.video_url,
            "username": video.owner.username,
            "profile_image": video.owner.profile_image,
            "views": video.views,
            "created_at": video.created_at.isoformat(),
        }
        for video in videos
    ]
