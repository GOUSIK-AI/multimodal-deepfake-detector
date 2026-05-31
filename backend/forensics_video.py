import cv2
import torch
import numpy as np

from transformers import VideoMAEImageProcessor
from transformers import VideoMAEForVideoClassification


# ---------------------------------------------------
# LOAD REAL TRANSFORMER MODEL
# ---------------------------------------------------

MODEL_NAME = "MCG-NJU/videomae-base"

print("⏳ Loading REAL Video Transformer...")

processor = VideoMAEImageProcessor.from_pretrained(MODEL_NAME)

model = VideoMAEForVideoClassification.from_pretrained(MODEL_NAME)

model.eval()

print("✅ REAL Video Transformer Loaded!")


# ---------------------------------------------------
# EXTRACT VIDEO FRAMES
# ---------------------------------------------------

def extract_frames(video_path, num_frames=16):

    cap = cv2.VideoCapture(video_path)

    frames = []

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames <= 0:
        return []

    indices = np.linspace(
        0,
        total_frames - 1,
        num_frames,
        dtype=int
    )

    current = 0

    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:
            break

        if current in indices:

            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            frame = cv2.resize(frame, (224, 224))

            frames.append(frame)

        current += 1

    cap.release()

    return frames


# ---------------------------------------------------
# VIDEO ANALYSIS
# ---------------------------------------------------

async def analyze_video_file(file_path):

    try:

        frames = extract_frames(file_path)

        if len(frames) == 0:

            return {
                "verdict": "ERROR",
                "detail": "Could not extract frames"
            }

        # -----------------------------------------
        # TRANSFORMER INFERENCE
        # -----------------------------------------

        inputs = processor(
            frames,
            return_tensors="pt"
        )

        with torch.no_grad():

            outputs = model(**inputs)

            logits = outputs.logits

            probs = torch.nn.functional.softmax(
                logits,
                dim=1
            )

        confidence = torch.max(probs).item()

        predicted_class = torch.argmax(probs).item()

        # -----------------------------------------
        # SOFT FAKE SCORING
        # -----------------------------------------

        fake_probability = float(1.0 - confidence)

        verdict = (
            "SUSPICIOUS / POSSIBLE FAKE"
            if fake_probability > 0.35
            else "LIKELY AUTHENTIC"
        )

        return {

            "verdict": verdict,

            "confidence": f"{round(fake_probability * 100, 2)}%",

            "analysis_type": "TRANSFORMER VIDEO ANALYSIS",

            "details": {
                "predicted_class": int(predicted_class),
                "real_probability": round(confidence, 4),
                "fake_probability": round(fake_probability, 4),
                "model": MODEL_NAME
            }
        }

    except Exception as e:

        return {
            "verdict": "ERROR",
            "detail": str(e)
        }