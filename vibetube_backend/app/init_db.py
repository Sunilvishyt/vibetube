from app.config.database import engine
from app.models.database_models import Base

print("creating database this file ......")
Base.metadata.create_all(bind=engine)
print("Done.")
