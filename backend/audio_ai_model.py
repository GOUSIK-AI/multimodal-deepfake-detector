import librosa
import numpy as np

print("✅ Lightweight Audio AI Model Loaded!")

def analyze_audio_ai(file_path):

    print("STEP 1")

    y, sr = librosa.load(
        file_path,
        sr=16000
    )

    print("STEP 2")

    flatness = np.mean(
        librosa.feature.spectral_flatness(y=y)
    )

    zcr = np.mean(
        librosa.feature.zero_crossing_rate(y)
    )

    centroid = np.mean(
        librosa.feature.spectral_centroid(
            y=y,
            sr=sr
        )
    )

    print("STEP 3")

    score = (
        (1.0 - min(flatness * 20, 1.0)) * 0.4 +
        min(zcr * 5, 1.0) * 0.3 +
        min(centroid / 4000.0, 1.0) * 0.3
    )

    score = max(
        0.0,
        min(score, 1.0)
    )

    print(f"🎤 Audio Score: {score:.4f}")

    return float(score)