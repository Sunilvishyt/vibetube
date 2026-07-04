from fastapi import Form, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.jwt_config import get_current_user_id
from app.models import database_models
from PIL import Image
from io import BytesIO
from app.config.database import get_db
import uuid
from app.config.supabase_config import supabase
from app.constants.supabase_constants import BUCKET_NAME


async def update_channel_details(
    username: str = Form(...),
    description: str = Form(None),
    profile_image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    # 1. Verify User Exists
    user = db.query(database_models.User).filter_by(id=current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Process Profile Image if provided
    if profile_image:
        if not profile_image.filename.lower().endswith(
            (".png", ".jpg", ".jpeg", ".webp")
        ):
            raise HTTPException(status_code=400, detail="Invalid image type")

        try:
            # Read file bytes into memory
            contents = await profile_image.read()
            img = Image.open(BytesIO(contents))

            # Convert to RGB to support saving cleanly as a standard JPEG/WEBP
            # (Avoids alpha-channel errors if they upload a transparent PNG)
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Resize avatar to your standard scale
            img = img.resize((128, 128))

            # Save optimized image into an in-memory byte buffer
            avatar_buffer = BytesIO()
            img.save(avatar_buffer, format="JPEG", quality=85)
            avatar_buffer.seek(0)  # Reset buffer stream position to the beginning

            # Generate a unique path/filename for the bucket file
            # Example: "user_42/avatar_a1b2c3d4.jpg"
            unique_token = uuid.uuid4().hex[:8]
            avatar_filename = f"user_{current_user_id}/avatar_{unique_token}.jpg"

            # 3. Optional: Delete old avatar from Supabase to prevent storage clutter
            # We look at the saved string path in your DB if it's already a Supabase pointer
            if user.profile_image and "supabase.co" in user.profile_image:
                try:
                    # Extract the old file path from the stored public URL
                    # e.g., from ".../public/avatars/user_42/avatar_old.jpg" -> "user_42/avatar_old.jpg"
                    old_path = user.profile_image.split(f"{BUCKET_NAME}/")[-1]
                    supabase.storage.from_(BUCKET_NAME).remove([old_path])
                except Exception as clean_err:
                    print(f"Warning: Failed to clear old avatar asset: {clean_err}")

            # 4. Upload raw optimized bytes straight to Supabase
            supabase.storage.from_(BUCKET_NAME).upload(
                path=avatar_filename,
                file=avatar_buffer.read(),
                file_options={"content-type": "image/jpeg", "cache-control": "3600"},
            )

            # 5. Fetch and update the direct target URL string
            public_avatar_url = supabase.storage.from_(BUCKET_NAME).get_public_url(
                avatar_filename
            )
            user.profile_image = public_avatar_url

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Image processing failed: {str(e)}"
            )
        finally:
            await profile_image.close()

    # 6. Save text fields and commit changes
    user.username = username
    user.channel_description = description
    db.commit()
    db.refresh(user)

    return user
