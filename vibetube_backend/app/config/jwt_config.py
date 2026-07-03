from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from dotenv import load_dotenv
from typing import Annotated
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from config import jwt_config
from fastapi.security import OAuth2PasswordBearer

import os

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token will expire after 30 minutes


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
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user_id(
    token: Annotated[
        str, Depends(oauth2_scheme)
    ],  # we will send token with header from react.
) -> int:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    """function to decode the JWT token received from frontend and extract the user ID"""
    try:
        # 1. Decoding the token using the secret key
        payload = jwt.decode(
            token, jwt_config.SECRET_KEY, algorithms=[jwt_config.ALGORITHM]
        )

        # 2. Extract the user ID (the 'sub' claim)
        user_id: str = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        # 3. Return the ID as an integer
        return int(user_id)

    except JWTError:
        # If decoding fails (wrong key, expired token, etc.)
        raise credentials_exception
