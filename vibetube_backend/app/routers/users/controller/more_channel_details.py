from sqlalchemy.orm import Session
from fastapi import Depends
from app.config.database import get_db
from app.models import database_models


def more_channel_details(
    channel_id: int,
    db: Session = Depends(get_db),
):
    total_videos = (
        db.query(database_models.Video)
        .filter(database_models.Video.user_id == channel_id)
        .count()
    )

    total_views = (
        db.query(database_models.View)
        .join(
            # 2. Join to the Video table
            database_models.Video,
            # 3. Use the explicit ON condition (or rely on relationships)
            database_models.View.video_id == database_models.Video.id,
        )
        .filter(
            # 4. Filter by the video's owner (the channel_id)
            database_models.Video.user_id == channel_id
        )
        .count()
    )
    total_subscribers = (
        db.query(database_models.Subscription)
        .filter(database_models.Subscription.channel_id == channel_id)
        .count()
    )
    return {
        "total_videos": total_videos,
        "total_views": total_views,
        "total_subscribers": total_subscribers,
    }
