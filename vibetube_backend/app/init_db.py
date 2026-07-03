from vibetube_backend.app.config.database import engine
from vibetube_backend.app.models.database_models import Base

print("creating database this file ......")
Base.metadata.create_all(bind=engine)
print("Done.")
