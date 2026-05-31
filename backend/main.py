import uuid
import shutil
import os

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from forensics_image import analyze_image_file
from forensics_audio import analyze_audio_file
from video_inference import detect_video

app = FastAPI(
    title="Multimodal Deepfake Detection Engine"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(
    "temp_files",
    exist_ok=True
)

@app.post("/analyze")
async def analyze_multimodal(
    file: UploadFile = File(...)
):

    file_id = f"{uuid.uuid4()}_{file.filename}"

    temp_path = os.path.join(
        "temp_files",
        file_id
    )

    with open(temp_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    ext = file.filename.split(".")[-1].lower()

    try:

        if ext in [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ]:

            result = await analyze_image_file(
                temp_path
            )

            return result

        elif ext in [
            "mp3",
            "wav",
            "m4a"
        ]:

            result = await analyze_audio_file(
                temp_path
            )

            return result

        elif ext in [
            "mp4",
            "avi",
            "mov",
            "mkv"
        ]:

            result = detect_video(
                temp_path
            )

            return result

        else:

            raise HTTPException(
                status_code=400,
                detail="Unsupported file format"
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

    finally:

        if os.path.exists(temp_path):

            os.remove(temp_path)