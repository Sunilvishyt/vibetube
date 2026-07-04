from fastapi import APIRouter
from app.schemas import pydantic_models
from app.routers.likes.likes_router import likes_router
from app.routers.comments.comments_router import comments_router
from app.routers.videos.controller.get_videos import get_videos
from app.routers.videos.controller.upload_videos import upload_video
from app.routers.videos.controller.get_single_video import get_single_video
from app.routers.videos.controller.search_videos import search_videos
from app.routers.videos.controller.update_view import update_view

videos_router = APIRouter()

videos_router.add_api_route(
    "/", get_videos, methods=["GET"], response_model=list[pydantic_models.VideoOut]
)

videos_router.add_api_route(
    "/", upload_video, methods=["POST"], response_model=pydantic_models.VideoOut
)

videos_router.add_api_route("/search", search_videos, methods=["GET"])
videos_router.add_api_route("/view", update_view, methods=["POST"])

videos_router.add_api_route(
    "/{video_id}",
    get_single_video,
    methods=["GET"],
    response_model=pydantic_models.VideoOut,
)

videos_router.include_router(likes_router, prefix="/likes", tags=["Likes"])
videos_router.include_router(comments_router, prefix="/comments", tags=["Comments"])
