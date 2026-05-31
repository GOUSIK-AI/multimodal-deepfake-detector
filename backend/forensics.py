# forensics.py
from PIL import Image, ImageChops, ImageEnhance
import os

def get_ela(image):
    """
    Performs Error Level Analysis (ELA) on an image.
    This creates a visual map showing areas with different compression levels.
    """
    # 1. Save a temporary version of the image at 90% quality
    temp_filename = "temp_ela_work.jpg"
    image.convert('RGB').save(temp_filename, 'JPEG', quality=90)
    resaved = Image.open(temp_filename)
    
    # 2. Calculate the difference between the original and the resaved version
    # Tampered areas will show up as bright spots in this difference image
    ela = ImageChops.difference(image.convert('RGB'), resaved)
    
    # 3. Enhance the contrast to make the differences easier to see
    extrema = ela.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    scale = 255.0 / max_diff if max_diff > 0 else 1
    
    ela = ImageEnhance.Brightness(ela).enhance(scale)
    
    # 4. Cleanup
    if os.path.exists(temp_filename):
        os.remove(temp_filename)
        
    return ela