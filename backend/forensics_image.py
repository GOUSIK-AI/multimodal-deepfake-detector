from PIL import Image
from ai_model import run_vit_model


async def analyze_image_file(file_path):

    image = Image.open(file_path).convert("RGB")

    fake_probability = run_vit_model(image)

    fake_confidence = round(
        fake_probability * 100,
        2
    )

    real_confidence = round(
        (1 - fake_probability) * 100,
        2
    )

    if fake_probability >= 0.5:

        label = "FAKE"

    else:

        label = "REAL"

    print("\n========== IMAGE FORENSICS ==========")

    print(
        f"FAKE: {fake_confidence}% | REAL: {real_confidence}%"
    )

    print(f"Prediction: {label}")

    print("=====================================\n")

    return {

        "label": label,

        "fake_confidence": fake_confidence,

        "real_confidence": real_confidence

    }