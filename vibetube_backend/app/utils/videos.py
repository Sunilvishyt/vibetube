import subprocess
import json


def format_duration(seconds: float) -> str:
    total_seconds = int(seconds)
    minutes = total_seconds // 60
    secs = total_seconds % 60
    return f"{minutes:02d}:{secs:02d}"


def get_video_duration(file_path: str) -> str:
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "json",
                file_path,
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        data = json.loads(result.stdout)
        duration_float = float(data["format"]["duration"])
        return format_duration(duration_float)

    except Exception as e:
        raise RuntimeError(f"Failed to read duration: {e}")
