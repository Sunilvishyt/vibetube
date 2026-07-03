from fastapi import APIRouter
from routers.likes.controller.like_video import like_video
from routers.likes.controller.get_likes_count import get_likes_count

likes_router = APIRouter()

likes_router.add_api_route("/", like_video, methods=["POST"])
likes_router.add_api_route("/{video_id}", get_likes_count, methods=["GET"])
