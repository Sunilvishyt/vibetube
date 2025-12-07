from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username : str
    email : Optional[EmailStr] = None
    password : str

class UserLogin(BaseModel):
    username : str
    password : str

class UserOut(BaseModel): #for sending the data out as a response.
    id : int
    profile_image : Optional[str] = None
    channel_description : Optional[str] = None
    created_at : datetime

    class Config:
        from_attributes =True


class VideoCreate(BaseModel):
    title:str
    description: Optional[str] = None
    visibility: Optional[str] = "public"
    category: Optional[str] = None


class VideoOut(VideoCreate):
    id: int
    user_id: int
    username: str
    video_url: str
    thumbnail_url: str
    views: int
    created_at: datetime

    class Config:
        from_attributes = True



class LikeToggle(BaseModel):
    video_id: int
    type: str  # "like" or "dislike"

class ViewIncrement(BaseModel):
    video_id: int

class CommentCreate(BaseModel):
    video_id: int
    text: str


class CommentOut(BaseModel):
    id: int
    user_id: int
    username: str
    video_id: int
    text: str
    created_at: datetime

    class Config:
        from_attributes = True

        
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"