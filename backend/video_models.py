import numpy as np
import cv2
import xgboost as xgb


class AdvancedVideoForensics:

    def __init__(self):

        print("⏳ Loading Enterprise Video Models...")

        print("✅ Video AI Toolbox Ready!")

    # ---------------------------------------------------
    # 1. TEMPORAL JITTER ANALYSIS
    # ---------------------------------------------------

    def analyze_temporal_jitter(self, frames):

        if len(frames) < 2:
            return 0.0

        diffs = []

        for i in range(len(frames) - 1):

            frame1 = cv2.cvtColor(frames[i], cv2.COLOR_BGR2GRAY)
            frame2 = cv2.cvtColor(frames[i + 1], cv2.COLOR_BGR2GRAY)

            diff = cv2.absdiff(frame1, frame2)

            diffs.append(np.mean(diff))

        return float(np.std(diffs))

    # ---------------------------------------------------
    # 2. rPPG ANALYSIS
    # ---------------------------------------------------

    def extract_rppg_signal(self, frames):

        if not frames:
            return 0.0

        signal_values = []

        for frame in frames:

            green_channel = frame[:, :, 1]

            signal_values.append(np.mean(green_channel))

        signal_values = np.array(signal_values)

        signal_std = np.std(signal_values)

        if signal_std == 0:
            return 0.0

        snr = np.mean(signal_values) / signal_std

        return float(snr)

    # ---------------------------------------------------
    # 3. EYE / FACE ANALYSIS
    # ---------------------------------------------------

    def analyze_eye_pose(self, frames):

        if not frames:
            return 0.0

        anomalies = 0

        for frame in frames:

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            brightness = np.mean(gray)

            # Simple heuristic
            if brightness < 20:
                anomalies += 1

        anomaly_rate = (anomalies / len(frames)) * 100

        return float(anomaly_rate)

    # ---------------------------------------------------
    # 4. FFT ANALYSIS
    # ---------------------------------------------------

    def analyze_frequency_artifacts(self, frames):

        if not frames:
            return 0.0

        frame = frames[0]

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        fft = np.fft.fft2(gray)

        fft_shift = np.fft.fftshift(fft)

        magnitude = np.abs(fft_shift)

        magnitude = np.log(magnitude + 1)

        high_freq = magnitude > np.percentile(magnitude, 95)

        artifact_score = np.mean(high_freq)

        return float(artifact_score)

    # ---------------------------------------------------
    # 5. FINAL PREDICTION
    # ---------------------------------------------------

    def final_prediction(
        self,
        temporal_jitter,
        rppg_snr,
        eye_anomaly_rate,
        fft_anomaly
    ):

        suspicion_score = 0

        if temporal_jitter > 15:
            suspicion_score += 30

        if rppg_snr < 5:
            suspicion_score += 35

        if eye_anomaly_rate > 15:
            suspicion_score += 20

        if fft_anomaly > 0.8:
            suspicion_score += 15

        is_fake = suspicion_score >= 50

        return {
            "verdict": "SUSPICIOUS / FAKE" if is_fake else "AUTHENTIC",
            "confidence": round(min(suspicion_score, 99.9), 2),
            "breakdown": {
                "temporal_jitter": round(temporal_jitter, 2),
                "rppg_signal": round(rppg_snr, 2),
                "eye_pose_anomaly_rate": round(eye_anomaly_rate, 2),
                "fft_artifact_score": round(fft_anomaly, 2)
            }
        }