# ==========================================
# STAGE 1: Builder
# ==========================================
FROM python:3.13-slim AS builder

# Install uv using the official Astral image binaries
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set up optimization flags for uv inside Docker
ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/app/.venv

WORKDIR /app

# Copy dependency configuration files first (maximizes Docker build cache)
COPY pyproject.toml uv.lock ./

# Synchronize project dependencies (creates the virtual environment)
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev


# ==========================================
# STAGE 2: Runtime (Final lean image)
# ==========================================
FROM python:3.13-slim AS runtime

# Install system runtime requirements: ffmpeg and ffprobe
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copy the pre-built virtual environment from the builder stage
COPY --from=builder /app/.venv /app/.venv

# 2. Copy your actual application source code into /app
COPY . .

# 3. Create the required storage directories structurally
RUN mkdir -p storage/videos storage/thumbnails storage/avatars

# 4. Ensure the virtual environment's binaries are at the front of the system PATH
ENV PATH="/app/.venv/bin:$PATH"

# 5. Set PYTHONPATH to the root directory so python can find the 'app' module cleanly
ENV PYTHONPATH="/app"

# Expose your backend port
EXPOSE 8000

# 6. Chain commands: First run database initialization, then boot Uvicorn from the root
CMD ["sh", "-c", "python app/init_db.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]