from fastapi import Depends, HTTPException
from app.config.jwt_config import get_current_user_id
from app.config.database import get_db
from app.models import database_models
from fastapi import UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from PIL import Image
from io import BytesIO
from app.utils.videos import get_video_duration
from app.constants.app_constants import (
    VIDEO_DIR,
    THUMB_DIR,
    THUMB_WIDTH,
    THUMB_HEIGHT,
    THUMB_QUALITY,
)
from app.constants.supabase_constants import BUCKET_NAME
from app.config.supabase_config import supabase


async def upload_video(
    title: str = Form(...),
    description: str = Form(None),
    category: str = Form(None),
    video: UploadFile = File(...),
    thumbnail: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    # 1. Validate video & image extensions
    if not video.filename.lower().endswith((".mp4", ".mov", ".avi", ".webm")):
        raise HTTPException(status_code=400, detail="Invalid video format")

    if not thumbnail.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        raise HTTPException(status_code=400, detail="Invalid thumbnail format")

    video_extension = os.path.splitext(video.filename)[1]
    thumb_extension = ".webp"

    video_filename = f"{uuid.uuid4()}{video_extension}"
    thumb_filename = f"{uuid.uuid4()}{thumb_extension}"

    # Temporary local paths for processing
    temp_video_path = os.path.join(VIDEO_DIR, video_filename)

    try:
        # 2. Save video locally temporarily to extract duration
        with open(temp_video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        duration = get_video_duration(temp_video_path)
        if duration == 0:
            raise HTTPException(
                status_code=500, detail="Could not extract video duration."
            )

        # 3. Process Thumbnail entirely in-memory using BytesIO
        thumb_content = await thumbnail.read()
        img = Image.open(BytesIO(thumb_content))

        if img.mode != "RGB":
            img = img.convert("RGB")

        img.thumbnail((THUMB_WIDTH, THUMB_HEIGHT))

        # Save optimized image into a bytes buffer instead of writing to disk
        thumb_buffer = BytesIO()
        img.save(thumb_buffer, format="WEBP", quality=THUMB_QUALITY)
        thumb_buffer.seek(0)  # Reset buffer pointer to the beginning

        # 4. Upload Assets to Supabase Storage

        # Upload Video from local temp file
        with open(temp_video_path, "rb") as vf:
            supabase.storage.from_(BUCKET_NAME).upload(
                path=video_filename,
                file=vf,
                file_options={"content-type": video.content_type},
            )

        # Upload Thumbnail from our memory buffer
        supabase.storage.from_(BUCKET_NAME).upload(
            path=thumb_filename,
            file=thumb_buffer.read(),
            file_options={"content-type": "image/webp"},
        )

        # 5. Get Public URLs from Supabase
        video_url = supabase.storage.from_(BUCKET_NAME).get_public_url(video_filename)
        thumbnail_url = supabase.storage.from_(BUCKET_NAME).get_public_url(
            thumb_filename
        )

        # 6. Save public production URLs to Postgres database
        new_video = database_models.Video(
            user_id=current_user_id,
            video_url=video_url,
            thumbnail_url=thumbnail_url,
            duration=duration,
            title=title,
            description=description,
            category=category,
        )
        db.add(new_video)
        db.commit()
        db.refresh(new_video)

        return new_video

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload workflow failed: {str(e)}")

    finally:
        # Crucial: Always clean up the temporary local video file regardless of success or failure
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)


async def upload_video_locally(
    title: str = Form(...),
    description: str = Form(None),
    category: str = Form(None),
    video: UploadFile = File(...),
    thumbnail: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):

    # Validate video
    if not video.filename.lower().endswith((".mp4", ".mov", ".avi", ".webm")):
        raise HTTPException(status_code=400, detail="Invalid video format")

    # Validate image
    if not thumbnail.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        raise HTTPException(status_code=400, detail="Invalid thumbnail format")

    video_extension = os.path.splitext(video.filename)[1]  # e.g., .mp4
    thumb_extension = ".webp"
    video_filename = f"{uuid.uuid4()}{video_extension}"  # e.g., d9e1c52a-9d5c-4a91-bf1f-a3003c12a92f.mp4
    thumb_filename = f"{uuid.uuid4()}{thumb_extension}"
    video_path = os.path.join(VIDEO_DIR, video_filename)
    thumb_path = os.path.join(THUMB_DIR, thumb_filename)

    # Save video
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    # Extract duration
    duration = get_video_duration(video_path)

    if duration == 0:
        # If metadata can't be read, delete file and abort
        os.remove(video_path)
        raise HTTPException(status_code=500, detail="Could not extract video duration.")

    # Save thumbnail
    try:
        thumb_content = await thumbnail.read()
        img = Image.open(BytesIO(thumb_content))

        # Convert to RGB (required for saving as JPEG/WEBP in some cases)
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Resize the image
        img.thumbnail((THUMB_WIDTH, THUMB_HEIGHT))  # Preserves aspect ratio

        # Save the optimized image to the target path
        img.save(thumb_path, format="WEBP", quality=THUMB_QUALITY)

    except Exception as e:  # if thumbnail fails videos gets deleted too.
        if os.path.exists(video_path):
            os.remove(video_path)

        raise HTTPException(
            status_code=500, detail=f"Failed to process or save thumbnail: {e}"
        )

    # 5. Save to database
    video = database_models.Video(
        user_id=current_user_id,
        video_url=f"http://127.0.0.1:8000/storage/videos/{video_filename}",
        thumbnail_url=f"http://127.0.0.1:8000/storage/thumbnails/{thumb_filename}",
        duration=duration,
        title=title,
        description=description,
        category=category,
    )

    db.add(video)
    db.commit()
    db.refresh(video)
    return video
