from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.sql import func

# ---------------- USER = CHANNEL ----------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=False)

    profile_image = Column(String, nullable=True)
    channel_description = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    videos = relationship("Video", back_populates="owner", cascade="all, delete")
    likes = relationship("Like", back_populates="user", cascade="all, delete")
    comments = relationship("Comment", back_populates="user", cascade="all, delete")
    view = relationship("View", back_populates="user", cascade="all, delete")

# ---------------- VIDEOS ----------------

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    username = Column(String(50), nullable=False)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    video_url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=False)  # auto extracted frame for now

    visibility = Column(String(20), default="public")  # public / private
    category = Column(String(50), nullable=True)

    views = Column(Integer, default=0)
    duration = Column(String(10), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owner = relationship("User", back_populates="videos")
    likes = relationship("Like", back_populates="video", cascade="all, delete")
    comments = relationship("Comment", back_populates="video", cascade="all, delete")
    view = relationship("View", back_populates="video", cascade="all, delete")

# ---------------- LIKES / DISLIKES ----------------

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"))

    type = Column(String(10), nullable=False)  # like / dislike

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="likes")
    video = relationship("Video", back_populates="likes")

# ---------------- COMMENTS ----------------

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    username = Column(String(50), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"))

    text = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="comments")
    video = relationship("Video", back_populates="comments")

#----------------------View---------------------

class View(Base):
    __tablename__ = "view"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint('user_id', 'video_id', name='_user_video_uc'),
    )

    #relationship
    user = relationship("User", back_populates="view")
    video = relationship("Video", back_populates="view")
