from PIL import Image

def get_metadata_risk(image):
    # This checks for common AI-generation software signatures
    exif = image.getexif()
    if exif:
        software = exif.get(305) # 305 is the Software tag
        if software and any(x in str(software).lower() for x in ['stable', 'dall-e', 'midjourney', 'ai']):
            return 1.0 # 100% Risk
    return 0.0