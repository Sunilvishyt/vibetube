from fastapi import APIRouter
from routers.users.controller.channel_details import channel_details
from routers.users.controller.more_channel_details import more_channel_details
from routers.users.controller.update_channel_details import update_channel_details

user_router = APIRouter()

user_router.add_api_route("/", update_channel_details, methods=["PUT"])

user_router.add_api_route("/{channel_id}", channel_details, methods=["GET"])

user_router.add_api_route(
    "/analytics/{channel_id}", more_channel_details, methods=["GET"]
)
