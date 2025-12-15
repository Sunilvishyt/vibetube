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

class UserOut(BaseModel):
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

class UserInVideo(BaseModel):
    id: int
    username: str
    profile_image: Optional[str] = None 

    class Config:
        from_attributes = True 

class VideoOut(VideoCreate):
    id: int
    user_id: int
    video_url: str
    thumbnail_url: str
    views: int
    created_at: datetime
    duration: str
    owner: UserInVideo
    class Config:
        from_attributes = True

class VideoQuery(BaseModel):
    vidQuery:str

class LikeToggle(BaseModel):
    video_id: int
    type: str 

class SubscribeToggle(BaseModel):
    user_id: int

class ViewIncrement(BaseModel):
    video_id: int

class CommentCreate(BaseModel):
    video_id: int
    text: str


class CommentUserOut(BaseModel):
    username: str
    profile_image: str | None

    class Config:
        from_attributes = True

class CommentOut(BaseModel):
    id: int
    video_id: int
    text: str
    created_at: datetime
    user: CommentUserOut 

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"