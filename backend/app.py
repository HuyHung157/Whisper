import os
import whisper
import tempfile
import numpy as np
import datetime
import time
import subprocess
import base64
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pydub import AudioSegment
from io import BytesIO
import sounddevice as sd


app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}},
)
socketio = SocketIO(app, cors_allowed_origins="*")

# model = whisper.load_model("large-v3", "cpu")
# model = whisper.load_model("large")
# model = whisper.load_model("medium")
model = whisper.load_model("base")


@app.route("/")
def home():
    return "Whisper Demo Backend"

# get a list of valid input devices


@app.route("/list-sound-device", methods=["GET"])
def get_valid_input_devices():
    valid_devices = []
    devices = sd.query_devices()
    hostapis = sd.query_hostapis()

    for device in devices:
        if device["max_input_channels"] > 0:
            device["host_api_name"] = hostapis[device["hostapi"]]["name"]
            valid_devices.append(device)
    return valid_devices


@app.route("/transcribe", methods=["POST"])
def transcribe():
    audio_file = request.files["audio"]
    target_language = request.form.get("targetLanguage", "")
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_audio_file:
            audio_file.save(temp_audio_file)
            temp_audio_file_path = temp_audio_file.name
            result = model.transcribe(temp_audio_file_path)
            language = result["language"]
        if target_language:
            output = model.transcribe(
                temp_audio_file_path, language=target_language)
            translate = output["text"]
            transcription = result["text"]
            os.remove(temp_audio_file_path)
            return jsonify(
                {
                    "transcription": transcription,
                    "translate": translate,
                    "language": language,
                }
            )
        else:
            transcription = result["text"]
            os.remove(temp_audio_file_path)
            return jsonify({"transcription": transcription, "language": language})
    except Exception as ex:
        print(f"Exception - transcription: {ex}")
        return jsonify({"error": "An error occurred during transcription"}), 500


def download_audio(youtube_link):
    audio_filename = "audio.mp3"
    command = [
        "yt-dlp",
        "--extract-audio",
        "--audio-format",
        "mp3",
        "--output",
        audio_filename,
        youtube_link,
    ]
    subprocess.run(command, check=True)
    return audio_filename


def transcribe_audio_from_youtube(youtube_link, target_language=None):
    try:
        audio_filename = download_audio(youtube_link)
        if target_language:
            result = model.transcribe(audio_filename)
            translation_result = model.transcribe(
                audio_filename, language=target_language
            )
        else:
            result = model.transcribe(audio_filename)
        os.remove(audio_filename)  # Clean up the downloaded file
        return result["segments"], translation_result["segments"]
    except Exception as e:
        return str(e)


def convert_to_srt(segments):
    srt_content = ""
    for i, segment in enumerate(segments):
        start_time = str(datetime.timedelta(seconds=int(segment["start"])))
        end_time = str(datetime.timedelta(seconds=int(segment["end"])))
        text = segment["text"]
        # srt_content += f"{i+1}\n{start_time},000 --> {end_time},000\n{text.strip()}\n\n"
        srt_content += f"{start_time},000 --> {end_time},000\n{text.strip()}\n"
    return srt_content


@app.route("/transcript-youtube", methods=["POST"])
def translate():
    # EN
    # https://www.youtube.com/watch?v=ry9SYnV3svc
    # JA
    # https://www.youtube.com/watch?v=qzzweIQoIOU
    data = request.get_json()
    youtube_link = data["youtubeUrl"]
    target_language = data.get("targetLanguage", "")
    if youtube_link:
        try:
            segments, translation_segments = transcribe_audio_from_youtube(
                youtube_link, target_language
            )
            if isinstance(segments, str):
                return (
                    jsonify({"error": segments}),
                    500,
                )  # Return error if transcription failed
            srt_content = convert_to_srt(segments)
            srt_translate = convert_to_srt(translation_segments)
            response = jsonify({"transcription": srt_content})
            if target_language == "en":
                response = jsonify(
                    {"transcription": srt_content, "translate": srt_translate}
                )
            return response
        except Exception as ex:
            print(f"Exception - translate: {ex}")
            return jsonify({"error": "An error occurred during translate"}), 500

    return jsonify({"error": "No YouTube link provided"}), 400


@app.route("/speech_to_text", methods=["POST"])
def speech_to_text():
    audio_file = request.files["audio"]
    transcription = model.speech_to_text(audio_file)
    return jsonify({"transcription": transcription})


@app.route("/text_to_speech", methods=["POST"])
def text_to_speech():
    text = request.json["text"]
    audio = model.text_to_speech(text)
    return jsonify({"audio": audio})


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


@socketio.on("audio")
def handle_audio(data):
    audio_base64 = data["audio"]
    audio_data = base64.b64decode(audio_base64.split(",")[1])
    audio_path = save_audio(audio_data)

    # Run transcription in a separate thread to avoid blocking SocketIO event loop
    threading.Thread(target=process_audio, args=(audio_path,)).start()


def save_audio(audio_data):
    path = f"tmp/{time.time()}.webm"
    try:
        with open(path, "wb") as f:
            f.write(audio_data)
        return path
    except Exception as e:
        print(f"Error saving audio file: {e}")
        return None


def process_audio(audio_path):
    transcription = transcribe_audio(audio_path)
    emit("transcription", {"text": transcription})


if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, port=5000, debug=True)
