import cv2
import torch
import numpy as np

from transformers import (
    VideoMAEImageProcessor,
    VideoMAEForVideoClassification
)

# =====================================================
# DEVICE
# =====================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print(f"🔥 USING DEVICE: {device}")

# =====================================================
# LOAD TRAINED MODEL
# =====================================================

MODEL_PATH = "./deepfake_model"

print("⏳ Loading trained VideoMAE model...")

processor = VideoMAEImageProcessor.from_pretrained(
    MODEL_PATH
)

model = VideoMAEForVideoClassification.from_pretrained(
    MODEL_PATH
)

model.to(device)

model.eval()

print("✅ TRAINED MODEL LOADED!")

# =====================================================
# FRAME EXTRACTION
# =====================================================

def extract_frames(
    video_path,
    num_frames=16
):

    cap = cv2.VideoCapture(video_path)

    frames = []

    total_frames = int(
        cap.get(cv2.CAP_PROP_FRAME_COUNT)
    )

    # HANDLE INVALID VIDEO
    if total_frames <= 0:

        return np.zeros(
            (16, 224, 224, 3),
            dtype=np.uint8
        )

    # BETTER FRAME SAMPLING
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

            # RGB
            frame = cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2RGB
            )

            # RESIZE
            frame = cv2.resize(
                frame,
                (224, 224)
            )

            frames.append(frame)

        current += 1

    cap.release()

    # PAD SHORT VIDEOS
    while len(frames) < num_frames:

        if len(frames) == 0:

            frames.append(
                np.zeros(
                    (224, 224, 3),
                    dtype=np.uint8
                )
            )

        else:

            frames.append(frames[-1])

    return frames

# =====================================================
# VIDEO DETECTION
# =====================================================

def detect_video(video_path):

    try:

        # ---------------------------------------------
        # EXTRACT FRAMES
        # ---------------------------------------------

        frames = extract_frames(video_path)

        frames = np.array(frames)

        # ---------------------------------------------
        # PROCESS INPUT
        # ---------------------------------------------

        inputs = processor(
            list(frames),
            return_tensors="pt"
        )

        pixel_values = inputs[
            "pixel_values"
        ].to(device)

        # ---------------------------------------------
        # INFERENCE
        # ---------------------------------------------

        with torch.no_grad():

            outputs = model(
                pixel_values=pixel_values
            )

            logits = outputs.logits

            probs = torch.softmax(
                logits,
                dim=1
            )

            real_score = probs[0][0].item()

            fake_score = probs[0][1].item()

        # ---------------------------------------------
        # CONFIDENCE LOGIC
        # ---------------------------------------------

        fake_percent = round(
            fake_score * 100,
            2
        )

        real_percent = round(
            real_score * 100,
            2
        )

        # MUCH BETTER THRESHOLDS

        if fake_score >= 0.90:

            label = "HIGHLY FAKE"

        elif fake_score >= 0.75:

            label = "SUSPICIOUS"

        else:

            label = "LIKELY REAL"

        # ---------------------------------------------
        # RETURN RESULT
        # ---------------------------------------------

        return {

            "label": label,

            "fake_confidence": fake_percent,

            "real_confidence": real_percent
        }

    except Exception as e:

        return {

            "label": "ERROR",

            "error": str(e)
        }

# =====================================================
# TEST
# =====================================================

if __name__ == "__main__":

    result = detect_video(
        "./datasets/video/fake/fake1.mp4"
    )

    print(result)