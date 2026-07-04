from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import database_models
from schemas import pydantic_models
from config.database import get_db
from utils.password_utils import hash_password
import random

router = APIRouter()
color_list = ["orange", "blue", "black", "red", "green"]


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

        # create avatar
        first_word = user_details.username[0].capitalize()
        color = random.choice(color_list)
        avatar_url = f"https://placehold.co/128x128/{color}/white?text={first_word}"

        user = database_models.User(
            username=user_details.username,
            profile_image=avatar_url,
            email=user_details.email,
            password_hash=hashed_password,
        )
        db.add(user)
        db.commit()
        return {"msg": "creation successful!"}

    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT, detail="Username is already taken"
    )
