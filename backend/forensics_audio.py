import librosa
import numpy as np

from audio_ai_model import analyze_audio_ai


async def analyze_audio_file(file_path):

    print("STEP A")

    y, sr = librosa.load(
        file_path,
        sr=None
    )

    print("STEP B")

    ai_score = analyze_audio_ai(
        file_path
    )

    print("STEP C")

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

    print("STEP D")

    dsp_score = (
        (1.0 - min(flatness * 10, 1.0)) * 0.5 +
        min(zcr * 2.0, 1.0) * 0.3 +
        min(centroid / 5000.0, 1.0) * 0.2
    )

    risk_score = (
        (dsp_score * 0.3) +
        (ai_score * 0.7)
    )

    risk_score = max(
        0.0,
        min(risk_score, 1.0)
    )

    fake_confidence = round(
        risk_score * 100,
        2
    )

    real_confidence = round(
        (1 - risk_score) * 100,
        2
    )

    if risk_score > 0.75:

        label = "FAKE"

    elif risk_score > 0.55:

        label = "SUSPICIOUS"

    else:

        label = "AUTHENTIC"

    print("\n========== AUDIO FORENSICS ==========")

    print(f"AI Score: {ai_score:.4f}")

    print(f"DSP Score: {dsp_score:.4f}")

    print(f"Final Risk Score: {risk_score:.4f}")

    print(f"Fake Confidence: {fake_confidence}%")

    print(f"Real Confidence: {real_confidence}%")

    print(f"Label: {label}")

    print("=====================================\n")

    return {

        "label": label,

        "fake_confidence": fake_confidence,

        "real_confidence": real_confidence

    }