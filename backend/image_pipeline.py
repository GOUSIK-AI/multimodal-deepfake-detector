import torch
from PIL import Image
from transformers import pipeline

# 1. Hardware Optimization (The Pro Move)
# Automatically detect if the server has a GPU for hyper-fast processing
if torch.cuda.is_available():
    device = 0 # GPU
    print("🚀 GPU Detected. Booting AI in high-performance mode.")
else:
    device = -1 # CPU
    print("🐢 No GPU detected. Booting AI on CPU mode.")

# 2. Load the State-of-the-Art Deepfake Model
MODEL_ID = "dima806/deepfake_vs_real_image_detection"

print(f"Connecting to Hugging Face... Downloading {MODEL_ID} weights.")
# This loads the model into memory ONCE so the API responds instantly later
ai_detector = pipeline(
    "image-classification", 
    model=MODEL_ID, 
    device=device
)
print("✅ Pro AI Engine Ready & Loaded into Memory!")

def analyze_image(file_path: str):
    """
    Production-grade image analysis using Vision Transformers.
    """
    try:
        # Pillow is significantly faster and more memory efficient than OpenCV here
        img = Image.open(file_path).convert("RGB")
    except Exception as e:
        raise ValueError(f"Corrupt or unreadable image file: {e}")

    # 3. Run Inference
    # The AI scans the image and returns a list sorted by confidence
    # Example: [{'label': 'fake', 'score': 0.99}, {'label': 'real', 'score': 0.01}]
    results = ai_detector(img)
    
    top_prediction = results[0]
    label = top_prediction['label'].upper()
    confidence = top_prediction['score'] * 100

    # 4. Standardize the Output for our API
    verdict = "AI_GENERATED" if label == "FAKE" else "AUTHENTIC"

    return {
        "modality": "image",
        "verdict": verdict,
        "confidence_score": round(confidence, 2),
        "ai_model_used": MODEL_ID,
        "processing_hardware": "GPU" if device == 0 else "CPU"
    }