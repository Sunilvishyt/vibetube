from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import database_models
from schemas import pydantic_models
from config.database import get_db
from utils.password_utils import hash_password
from utils.avatar_utils import get_avatar_filepath, get_avatar_url
from utils.avatar_generater import generate_initial_avatar

router = APIRouter()


# @router.post("/")
def register_user(
    user_details: pydantic_models.UserCreate, db: Session = Depends(get_db)
):
    user_exists = (
        db.query(database_models.User).filter_by(username=user_details.username).first()
    )

    if not user_exists:
        email_exists = (
            db.query(database_models.User).filter_by(email=user_details.email).first()
        )

        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
            )

        hashed_password = hash_password(user_details.password)
        new_user_id = db.query(database_models.User).count() + 1
        avatar_path = get_avatar_filepath(new_user_id)

        generate_initial_avatar(
            user_id=new_user_id,
            full_name=user_details.username,
            output_path=avatar_path,
        )

        user = database_models.User(
            username=user_details.username,
            profile_image=f"http://127.0.0.1:8000{get_avatar_url(new_user_id)}",
            email=user_details.email,
            password_hash=hashed_password,
        )
        db.add(user)
        db.commit()
        return {"msg": "creation successful!"}

    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT, detail="Username is already taken"
    )
