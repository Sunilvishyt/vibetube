from fastapi import APIRouter
from app.routers.subscribers.controller.subscribe_channel import subscribe_to_channel
from app.routers.subscribers.controller.get_subscribers import get_subscribers

subscriber_router = APIRouter()

subscriber_router.add_api_route("/", subscribe_to_channel, methods=["POST"])

subscriber_router.add_api_route("/{channel_id}", get_subscribers, methods=["GET"])
