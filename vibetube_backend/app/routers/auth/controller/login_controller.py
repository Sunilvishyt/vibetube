from fastapi import APIRouter, Depends, HTTPException, status
from utils.password_utils import verify_hash
from schemas import pydantic_models
from models import database_models
from sqlalchemy.orm import Session
from config.database import get_db
from datetime import timedelta
from config import jwt_config

router = APIRouter()


# @router.post("/", response_model=pydantic_models.Token)
def login_user(user_details: pydantic_models.UserLogin, db: Session = Depends(get_db)):

    user_exists = (
        db.query(database_models.User).filter_by(username=user_details.username).first()
    )
    if user_exists:
        if verify_hash(user_exists.password_hash, user_details.password):
            access_token_expires = timedelta(
                minutes=jwt_config.ACCESS_TOKEN_EXPIRE_MINUTES
            )

            access_token = jwt_config.create_access_token(
                data={"sub": str(user_exists.id)}, expires_delta=access_token_expires
            )
            return {"access_token": access_token, "token_type": "bearer"}

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="username does not exists!",
        headers={"WWW-Authenticate": "Bearer"},
    )
