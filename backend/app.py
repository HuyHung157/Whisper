from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import whisper
import tempfile
import os
import pytube as pt

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
model = whisper.load_model("large-v3")

@app.route('/')
def home():
    return "Whisper Demo Backend"

@app.route('/transcribe', methods=['POST'])
def transcribe(isYoutube):
    audio_file = request.files['audio']
    try:
        if (isYoutube):
          # download mp3 from youtube video (Breaking Italy)
          yt = pt.YouTube("https://www.youtube.com/watch?v=4KI9BBW_aP8")
          stream = yt.streams.filter(only_audio=True)[0]
          stream.download(filename="audio_italian.mp3")
          result = model.transcribe("audio_italian.mp3")
          transcription = result["text"]
        else:
          with tempfile.NamedTemporaryFile(delete=False) as temp_audio_file:
              audio_file.save(temp_audio_file)
              temp_audio_file_path = temp_audio_file.name
          result = model.transcribe(temp_audio_file_path)
          transcription = result["text"]
          os.remove(temp_audio_file_path)  # Clean up the temporary file

        return jsonify({'transcription': transcription})
    except Exception as ex:
        print(f"Exception - transcription: {ex}")
        return jsonify({'error': 'An error occurred during transcription'}), 500

@app.route('/translate', methods=['POST'])
def translate():
  try:
      text = request.json['text']
      target_lang = request.json['target_lang']
      translation = model.transcribe(text, language=target_lang)
      return jsonify({'translation': translation})
  except Exception as ex:
      print(f"Exception - translate: {ex}")
      return jsonify({'error': 'An error occurred during translate'}), 500

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
