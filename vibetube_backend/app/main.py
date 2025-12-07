from fastapi import FastAPI, Depends, HTTPException, status, File, Form, UploadFile, Query
from fastapi.security import OAuth2PasswordBearer # Tool to extract token from header
from fastapi.staticfiles import StaticFiles
from sqlalchemy.sql.expression import func
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, case
from database import get_db
import bcrypt
import pydantic_models
import database_models
import jwt_config
import os, shutil
from dotenv import load_dotenv
from typing import Annotated
from jose import jwt, JWTError
import uuid

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
app = FastAPI()
origins = [
    "http://localhost:5173",
    "https://yourfreedomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.mount("/videos", StaticFiles(directory="storage/videos"), name="videos")
app.mount("/thumbnails", StaticFiles(directory="storage/thumbnails"), name="thumbnails")

VIDEO_DIR = "storage/videos"
THUMB_DIR = "storage/thumbnails"

os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(THUMB_DIR, exist_ok=True)

# --- Function to hash password and verify.---
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


def varify_hash(hashed_password: str, user_entered_password) -> bool:
    return bcrypt.checkpw(user_entered_password.encode('utf-8'), hashed_password.encode('utf-8'))


async def get_current_user_id(
        token: Annotated[str, Depends(oauth2_scheme)]  #we will send token with header from react.
) -> int:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # 1. Decode the token using the secret key
        payload = jwt.decode(token, jwt_config.SECRET_KEY, algorithms=[jwt_config.ALGORITHM])

        # 2. Extract the user ID (the 'sub' claim)
        user_id: str = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        # 3. Return the ID as an integer
        return int(user_id)

    except JWTError:
        # If decoding fails (wrong key, expired token, etc.)
        raise credentials_exception


@app.post('/register')
def create_user(user_details: pydantic_models.UserCreate, db: Session = Depends(get_db)):
    user_exists = db.query(database_models.User).filter_by(
        username = user_details.username
    ).first()

    if not user_exists:
        hashed_password = hash_password(user_details.password)
        user = database_models.User(username=user_details.username,
                                    email=user_details.email,
                                    password_hash=hashed_password)
        db.add(user)
        db.commit()
        return {"msg": "creation successful!"}

    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Username is already taken"
    )


@app.post('/login', response_model=pydantic_models.Token)
def login_user_for_access_token(user_details: pydantic_models.UserLogin,
                                db: Session = Depends(get_db)):

    user_exists = db.query(database_models.User).filter_by(username = user_details.username).first()
    if user_exists:
        if varify_hash(user_exists.password_hash, user_details.password):

            # 2. Authentication Successful - Create Token
            access_token_expires = timedelta(minutes=jwt_config.ACCESS_TOKEN_EXPIRE_MINUTES)

            access_token = jwt_config.create_access_token(
                # The payload contains the user's ID
                data={"sub": str(user_exists.id)},
                expires_delta=access_token_expires
            )
            # 3. Return the Token
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

@app.post("/upload-video", response_model=pydantic_models.VideoOut)
async def upload_video(
    title: str = Form(...),
    description: str = Form(None),
    category: str = Form(None),
    video: UploadFile = File(...),
    thumbnail:UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user_id:int = Depends(get_current_user_id)
):
    # Validate video
    if not video.filename.lower().endswith((".mp4", ".mov", ".avi", ".mkv", ".webm")):
        raise HTTPException(status_code=400, detail="Invalid video format")

    # Validate image
    if not thumbnail.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        raise HTTPException(status_code=400, detail="Invalid thumbnail format")

    video_extension = os.path.splitext(video.filename)[1]  # e.g., .mp4
    thumb_extension = os.path.splitext(thumbnail.filename)[1]  # e.g., .jpg

    video_filename = f"{uuid.uuid4()}{video_extension}"  # e.g., d9e1c52a-9d5c-4a91-bf1f-a3003c12a92f.mp4
    thumb_filename = f"{uuid.uuid4()}{thumb_extension}"

    video_path = os.path.join(VIDEO_DIR, video_filename)
    thumb_path = os.path.join(THUMB_DIR, thumb_filename)

    # Save video
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    # Save thumbnail
    with open(thumb_path, "wb") as buffer:
        shutil.copyfileobj(thumbnail.file, buffer)

    #fetch username
    user = db.query(database_models.User).filter_by(id=current_user_id).first()

    # 5. Save to database
    video = database_models.Video(
        user_id=current_user_id,
        username=user.username,
        video_url=f"http://127.0.0.1:8000/videos/{video_filename}",
        thumbnail_url=f"http://127.0.0.1:8000/thumbnails/{thumb_filename}",
        title=title,
        description=description,
        category=category
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    return video


DEFAULT_VIDEO_LIMIT = 12
@app.get("/getvideos/{vid_query}", response_model=list[pydantic_models.VideoOut])
def get_videos(
        vid_query: str,
        limit: int = Query(DEFAULT_VIDEO_LIMIT, ge=1, le=50),  # Max 50 per request
        offset: int = Query(0, ge=0),
        db: Session = Depends(get_db)
):
    """
    Fetches videos with pagination using limit and offset.
    """
    VALID_CATEGORIES = {"music", "movies", "gaming", "anime", "education", "entertainment", "tech", "news", "vlogs"}

    if vid_query != "random" and vid_query not in VALID_CATEGORIES:
        raise HTTPException(400, "Invalid category")

    # Base query
    basequery = db.query(database_models.Video)

    if vid_query == "random":
        # Random videos: Apply ordering, limit, and offset
        videos = (
            basequery.order_by(func.random()).offset(offset).limit(limit).all()
        )
    else:
        # Category videos: Filter by category, then apply limit and offset
        videos = (
            basequery
            .filter(database_models.Video.category == vid_query)
            # You might want to order by date or views here, not func.random()
            .order_by(database_models.Video.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
    return videos

"""
Response body
Download
[
  {
    "title": "string",
    "description": "string",
    "visibility": "public",
    "category": "string",
    "id": 1,
    "user_id": 1,
    "video_url": "http://127.0.0.1:8000/videos/7f10f866-20c9-4062-b935-58698ef45c1b.mp4",
    "thumbnail_url": "http://127.0.0.1:8000/thumbnails/a0973665-3080-496e-a0dd-45afdeeca3cb.png",
    "views": 0,
    "created_at": "2025-12-04T07:56:35"
  },
  {
    "title": "string",
    "description": "string",
    "visibility": "public",
    "category": "string",
    "id": 2,
    "user_id": 1,
    "video_url": "http://127.0.0.1:8000/videos/fdbb6e42-a784-43ee-ae03-7cfaf3ee85c6.mp4",
    "thumbnail_url": "http://127.0.0.1:8000/thumbnails/7abc306c-b144-46d5-aed2-f9b0b3173a5c.png",
    "views": 0,
    "created_at": "2025-12-04T07:57:00"
  }
]
"""

@app.get("/getvideo/{video_id}", response_model=pydantic_models.VideoOut)
def get_single_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(database_models.Video).filter_by(id = video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


@app.post("/like")
def like_video(data: pydantic_models.LikeToggle,
               db: Session = Depends(get_db),
               current_user_id: int = Depends(get_current_user_id)):

    existing = db.query(database_models.Like).filter(
        database_models.Like.video_id == data.video_id,
        database_models.Like.user_id == current_user_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Removed"}

    new_like = database_models.Like(
        video_id=data.video_id,
        user_id=current_user_id,
        type=data.type
    )

    db.add(new_like)
    db.commit()
    return {"message": "Added"}


@app.get("/likes/{video_id}")
def get_like_count(video_id: int, db: Session = Depends(get_db), current_user_id:int = Depends(get_current_user_id)):
    count = db.query(database_models.Like).filter(database_models.Like.video_id == video_id).count()
    user_liked = db.query(database_models.Like).filter(
        database_models.Like.video_id == video_id,
        database_models.Like.user_id == current_user_id).first()

    if user_liked:
        return {"liked": "true", "likes": count}
    else:
        return {"liked": "false", "likes": count}



@app.post("/comment", response_model=pydantic_models.CommentOut)
def create_comment(data: pydantic_models.CommentCreate,
                   db: Session = Depends(get_db),
                   current_user_id: int = Depends(get_current_user_id)
                   ):

    username = db.query(database_models.User).filter_by(id=current_user_id).first()
    new_comment = database_models.Comment(
        video_id= data.video_id,
        user_id=current_user_id,
        username = username.username,
        text=data.text
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment


@app.get("/comments/{video_id}")
def get_comments(video_id: int, db: Session = Depends(get_db)):

    comments = db.query(database_models.Comment).filter(
        database_models.Comment.video_id == video_id
    ).order_by(database_models.Comment.created_at.desc()).all()

    return comments

""" response we will get like this -
[
  {
    "username": "test",
    "user_id": 1,
    "text": "second this is the pushed comment by me.",
    "id": 2,
    "video_id": 1,
    "created_at": "2025-12-04T08:01:00"
  },
  {
    "username": "test",
    "user_id": 1,
    "text": "this is the pushed comment by me.",
    "id": 1,
    "video_id": 1,
    "created_at": "2025-12-04T08:00:23"
  }
]
"""
@app.get('/verify-token')
def verify_token(db:Session = Depends(get_db),
                 current_user_id : int = Depends(get_current_user_id)):
    user = db.query(database_models.User).filter_by(id=current_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or token invalid"
        )
    return {"details":user}


@app.get("/search")
def search_videos(
    query: str = Query(..., min_length=1),
    # Change 'page' to 'offset'
    offset: int = Query(0, ge=0),
    limit: int = Query(12, le=100), # Change default limit to 12
    db: Session = Depends(get_db),
):
    # Remove the offset calculation: offset = (page - 1) * limit
    like_query = f"%{query}%"

    videos = (
        db.query(database_models.Video)
        .filter(
            or_(
                database_models.Video.title.ilike(like_query),
                database_models.Video.description.ilike(like_query),
                database_models.Video.username.ilike(like_query),
            )
        )
        .order_by(
            case(
        (database_models.Video.title.ilike(like_query), 1),
                (database_models.Video.username.ilike(like_query), 2),
                else_=3
    ),
    database_models.Video.views.desc())
        .offset(offset) # Use the offset directly
        .limit(limit)
        .all()
    )

    return [
        {
            "id": video.id,
            "title": video.title,
            "thumbnail_url": video.thumbnail_url,
            "video_url": video.video_url,
            "username": video.username,
            "views": video.views,
            "created_at": video.created_at.isoformat(),
        }
        for video in videos
    ]


@app.post('/view')
def increase_view(data:pydantic_models.ViewIncrement,
                  db:Session = Depends(get_db),
                  current_user_id: int = Depends(get_current_user_id)
):
    existing = db.query(database_models.View).filter(
        database_models.View.video_id == data.video_id,
        database_models.View.user_id == current_user_id
    ).first()

    if not existing:
        create_view = database_models.View(
            user_id = current_user_id,
            video_id = data.video_id,
        )
        db.add(create_view)

        video = db.query(database_models.Video).filter(
            database_models.Video.id == data.video_id
        ).first()

        if video:
            video.views = (video.views or 0) + 1
            db.commit()
            return {"msg":"view updated successfully!"}

        else:
            return {"msg":"video not found"}
    else:
        return {"msg":"view already registered!"}





