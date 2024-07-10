import os
import whisper
import tempfile
import numpy as np
import datetime
import subprocess
import base64
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO


app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}},
)
socketio = SocketIO(app, cors_allowed_origins="*")

# model = whisper.load_model("large-v3", "cpu")
# model = whisper.load_model("large")
# model = whisper.load_model("medium")
model = whisper.load_model("base")


@app.route("/")
def home():
    return "Whisper Demo Backend"


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
            output = model.transcribe(temp_audio_file_path, language=target_language)
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


@app.route("/detect_language", methods=["POST"])
def detect_language():
    text = request.json["text"]
    language = model.detect_language(text)
    return jsonify({"language": language})


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


@socketio.on("audio")
def handle_audio(audio_data):
    try:
        audio_base64 = audio_data["audio_base64"]
        audio_bytes = base64.b64decode(audio_base64)
        # Example: Perform audio processing (transcription)
        transcription_result = transcribe_audio(audio_bytes)
        # Emit transcription result back to the client
        socketio.emit("audio_response", {"transcription": transcription_result})
    except Exception as e:
        print(f"Error handling audio data: {e}")
        socketio.emit("audio_response", {"error": str(e)})


def transcribe_audio(audio_bytes):
    # Example: Simulated transcription process (replace with your actual logic)
    # In a real application, you would use a suitable library (e.g., Google Speech-to-Text API, etc.)
    
    # Simulate some delay for processing (asyncio.sleep can be replaced with actual transcription logic)
    asyncio.run(asyncio.sleep(2))
    
    # Convert bytes to numpy array (example: assume 16-bit PCM audio)
    audio_np = np.frombuffer(audio_bytes, dtype=np.int16)
    
    # Example: Simple mock transcription (you should replace this with your actual logic)
    transcription = f"Mock transcription: Audio length={len(audio_np)} samples"
    
    return transcription


if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, port=5000, debug=True)
