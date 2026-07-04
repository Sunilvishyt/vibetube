from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.constants.app_constants import FRONTEND_URL

origins = ["http://localhost:5173", FRONTEND_URL]


def configure_app(app: FastAPI):

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.mount(
        "/storage/avatars", StaticFiles(directory="storage/avatars"), name="avatars"
    )
    app.mount("/storage/videos", StaticFiles(directory="storage/videos"), name="videos")
    app.mount(
        "/storage/thumbnails",
        StaticFiles(directory="storage/thumbnails"),
        name="thumbnails",
    )
