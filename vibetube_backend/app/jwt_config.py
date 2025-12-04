import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt

load_dotenv()

# 1. Hashing Context (used for passwords, already set up)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 45  # Token will expire after 30 minutes

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Creates a new JWT access token.
    data: Dictionary containing the payload (e.g., {"sub": user_id})
    """
    to_encode = data.copy()

    # 1. Set the Expiration Time (exp claim)
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # The 'sub' (subject) claim is often used for the unique identifier (user ID)
    to_encode.update({"exp": expire})

    # 2. Encode and Sign the Token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


