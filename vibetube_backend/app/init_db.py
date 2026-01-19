from database import engine
from database_models import Base

print("creating database this file ......")
Base.metadata.create_all(bind=engine)
print("Done.")
