from fastapi import APIRouter
from schemas import pydantic_models
from routers.comments.controller.create_comment import create_comment
from routers.comments.controller.get_comments import get_comments

comments_router = APIRouter()

comments_router.add_api_route(
    "/{video_id}",
    get_comments,
    methods=["GET"],
    response_model=list[pydantic_models.CommentOut],
)

comments_router.add_api_route(
    "/", create_comment, methods=["POST"], response_model=pydantic_models.CommentOut
)
