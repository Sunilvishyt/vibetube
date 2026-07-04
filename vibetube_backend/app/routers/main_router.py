from fastapi import APIRouter
from app.routers.auth.auth_router import auth_router
from app.routers.videos.videos_router import videos_router
from app.routers.subscribers.subscriber_router import subscriber_router
from app.routers.users.user_router import user_router

main_router = APIRouter()

main_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
main_router.include_router(videos_router, prefix="/videos", tags=["Videos"])
main_router.include_router(
    subscriber_router, prefix="/subscribers", tags=["Subscribers"]
)
main_router.include_router(user_router, prefix="/users", tags=["Users"])
