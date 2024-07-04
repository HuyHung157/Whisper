import React, { useState } from 'react';
import jwtAxios from '../services/jwt-auth';

const SpeechToText = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (audioFile) {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await jwtAxios.post('/speech_to_text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data.transcription);
    }
  };

  return (
    <div>
      <h2>Speech to Text</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Convert</button>
      <div>{transcription}</div>
    </div>
  );
};

export default SpeechToText;
