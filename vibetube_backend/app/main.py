from config.app_setup import configure_app
from dotenv import load_dotenv
from routers.main_router import main_router
from fastapi import (
    FastAPI,
)

load_dotenv()

app = FastAPI()
configure_app(app=app)

app.include_router(main_router, prefix="/api")
