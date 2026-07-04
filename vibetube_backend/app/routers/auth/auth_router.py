from fastapi import APIRouter
from app.routers.auth.controller.login_controller import login_user as login_controller
from app.routers.auth.controller.register_controller import (
    register_user as register_controller,
)
from app.routers.auth.controller.verify_token_controller import (
    verify_token as verify_token_controller,
)

auth_router = APIRouter()

auth_router.add_api_route("/login", login_controller, methods=["POST"])
auth_router.add_api_route("/register", register_controller, methods=["POST"])
auth_router.add_api_route("/verify-token", verify_token_controller, methods=["GET"])
