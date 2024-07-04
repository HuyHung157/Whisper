from flask import Flask, request, jsonify
from flask_cors import CORS
# from models.whisper_model import WhisperModel
import numpy as np
import whisper

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
# model = WhisperModel()
model = whisper.load_model("base")

@app.route('/')
def home():
    return "Whisper Demo Backend"

@app.route('/transcribe', methods=['POST'])
def transcribe():
    audio_file = request.files['audio']
    transcription = model.transcribe(audio_file)
    return jsonify({'transcription': transcription})

@app.route('/translate', methods=['POST'])
def translate():
    text = request.json['text']
    target_lang = request.json['target_lang']
    translation = model.translate(text, target_lang)
    return jsonify({'translation': translation})

@app.route('/speech_to_text', methods=['POST'])
def speech_to_text():
    audio_file = request.files['audio']
    transcription = model.speech_to_text(audio_file)
    return jsonify({'transcription': transcription})

@app.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    text = request.json['text']
    audio = model.text_to_speech(text)
    return jsonify({'audio': audio})

@app.route('/detect_language', methods=['POST'])
def detect_language():
    text = request.json['text']
    language = model.detect_language(text)
    return jsonify({'language': language})

if __name__ == '__main__':
    app.run(debug=True)
