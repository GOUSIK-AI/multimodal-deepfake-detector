import os
import cv2
import torch
import random
import numpy as np

from torch.utils.data import Dataset

from transformers import (
    VideoMAEImageProcessor,
    VideoMAEForVideoClassification,
    TrainingArguments,
    Trainer
)

# =====================================================
# DEVICE
# =====================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print(f"🔥 USING DEVICE: {device}")

# =====================================================
# MODEL
# =====================================================

MODEL_NAME = "MCG-NJU/videomae-base"

print("⏳ Loading VideoMAE Processor...")

processor = VideoMAEImageProcessor.from_pretrained(
    MODEL_NAME
)

print("⏳ Loading VideoMAE Model...")

model = VideoMAEForVideoClassification.from_pretrained(
    MODEL_NAME,
    num_labels=2,
    ignore_mismatched_sizes=True
)

model.to(device)

print("✅ VideoMAE Loaded!")

# =====================================================
# DATASET
# =====================================================

class DeepfakeVideoDataset(Dataset):

    def __init__(self, root_dir):

        self.samples = []

        real_dir = os.path.join(root_dir, "real")
        fake_dir = os.path.join(root_dir, "fake")

        # REAL VIDEOS
        for file in os.listdir(real_dir):

            if file.endswith(".mp4"):

                self.samples.append(
                    (
                        os.path.join(real_dir, file),
                        0
                    )
                )

        # FAKE VIDEOS
        for file in os.listdir(fake_dir):

            if file.endswith(".mp4"):

                self.samples.append(
                    (
                        os.path.join(fake_dir, file),
                        1
                    )
                )

        random.shuffle(self.samples)

        print(f"✅ TOTAL SAMPLES: {len(self.samples)}")

    def __len__(self):

        return len(self.samples)

    # -------------------------------------------------
    # EXTRACT VIDEO FRAMES
    # -------------------------------------------------

    def extract_frames(
        self,
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

                frame = cv2.cvtColor(
                    frame,
                    cv2.COLOR_BGR2RGB
                )

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

    # -------------------------------------------------
    # DATASET ITEM
    # -------------------------------------------------

    def __getitem__(self, idx):

        video_path, label = self.samples[idx]

        frames = self.extract_frames(video_path)

        inputs = processor(
            frames,
            return_tensors="pt"
        )

        pixel_values = inputs[
            "pixel_values"
        ].squeeze(0)

        return {

            "pixel_values": pixel_values,

            "labels": torch.tensor(
                label,
                dtype=torch.long
            )
        }

# =====================================================
# LOAD DATASET
# =====================================================

dataset = DeepfakeVideoDataset(
    "./datasets/video"
)

# =====================================================
# TRAINING SETTINGS
# =====================================================

training_args = TrainingArguments(

    output_dir="./deepfake_model",

    per_device_train_batch_size=1,

    num_train_epochs=5,

    learning_rate=1e-5,

    save_steps=5,

    save_total_limit=2,

    logging_steps=1,

    remove_unused_columns=False,

    fp16=torch.cuda.is_available(),

    dataloader_num_workers=0
)

# =====================================================
# TRAINER
# =====================================================

trainer = Trainer(

    model=model,

    args=training_args,

    train_dataset=dataset
)

# =====================================================
# START TRAINING
# =====================================================

print("🚀 STARTING DEEPFAKE TRAINING...")

trainer.train()

# =====================================================
# SAVE MODEL
# =====================================================

print("💾 Saving model...")

model.save_pretrained(
    "./deepfake_model"
)

processor.save_pretrained(
    "./deepfake_model"
)

print("✅ TRAINING COMPLETED!")
print("✅ MODEL SAVED TO: ./deepfake_model")