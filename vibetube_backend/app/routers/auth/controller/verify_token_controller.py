from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import database_models
from app.config.database import get_db
from app.config.jwt_config import get_current_user_id

router = APIRouter()


# @router.get("/")
def verify_token(
    db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)
):
    user = db.query(database_models.User).filter_by(id=current_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or token invalid",
        )
    return {"details": user}
