from database import engine
from database_models import Base

print("for creating database run this file once...")
Base.metadata.create_all(bind=engine)
print("Done.")
