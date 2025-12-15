from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Define a palette of pleasant, contrasting colors (hex codes)
COLOR_PALETTE = [
    "#4A90E2",  # Blue
    "#50E3C2",  # Mint Green
    "#F5A623",  # Orange
    "#BD10E0",  # Purple
    "#7ED321",  # Lime Green
    "#D0021B",  # Red
    "#9013FE",  # Violet
]
TEXT_COLOR = "#FFFFFF"  # White text for contrast

def generate_color(user_id: int) -> str:
    """Selects a stable color based on the user ID."""
    # Use modulo to cycle through the color palette
    index = user_id % len(COLOR_PALETTE)
    return COLOR_PALETTE[index]

def generate_initial_avatar(user_id: int, full_name: str, output_path: Path):
    """
    Generates and saves a letter-based profile picture.

    :param user_id: Unique identifier for color consistency.
    :param full_name: The name to extract the initial from.
    :param output_path: The full file path where the image will be saved.
    """
    initial = full_name[0].upper()
    size = (128, 128)
    bg_color = generate_color(user_id)
    
    # 1. Create the Image
    img = Image.new('RGB', size, color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # 2. Prepare the Font (You might need to adjust the path/name)
    try:
        # Tries to use a standard system font, or a basic default
        # If this fails, consider providing a .ttf file in your project directory
        font = ImageFont.truetype("arial.ttf", 60)
    except IOError:
        # Fallback if the specified font is not found
        font = ImageFont.load_default()
        print("Warning: Arial font not found, using default.")

    # 3. Calculate Text Position
    # Get the bounding box of the text
    bbox = draw.textbbox((0, 0), initial, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    x = (size[0] - text_width) / 2
    y = (size[1] - text_height) / 2 - 5 # -5 is a typical vertical adjustment for centering
    
    # 4. Draw the Text
    draw.text((x, y), initial, fill=TEXT_COLOR, font=font)
    
    # 5. Save the Image
    img.save(output_path, 'PNG')
    print(f"Avatar generated and saved to: {output_path}")

# --- Example Usage (Not part of FastAPI, just for testing) ---
# user_id = 123
# user_name = "Charlie"
# save_dir = Path("./avatars")
# save_dir.mkdir(exist_ok=True)
# filename = f"{user_id}.png"
# 
# generate_initial_avatar(user_id, user_name, save_dir / filename)