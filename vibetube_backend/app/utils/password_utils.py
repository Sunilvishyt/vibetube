import bcrypt


# --- Function to hash password and verify.---
def hash_password(password: str) -> str:
    """Returns the hashed password."""
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed_password.decode("utf-8")


def verify_hash(hashed_password: str, user_entered_password) -> bool:
    """Return true if user enters correct password."""
    return bcrypt.checkpw(
        user_entered_password.encode("utf-8"), hashed_password.encode("utf-8")
    )
