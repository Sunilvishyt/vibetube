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

class UserInVideo(BaseModel):
    id: int
    username: str
    # The profile_image lives here, on the User model
    profile_image: Optional[str] = None # <-- IMPORTANT: Set as Optional if it can be NULL in the DB

    class Config:
        from_attributes = True # Allows Pydantic to read ORM attributes

class VideoOut(VideoCreate):
    id: int
    user_id: int
    username: str
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
    type: str  # "like" or "dislike"

class SubscribeToggle(BaseModel):
    user_id: int

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