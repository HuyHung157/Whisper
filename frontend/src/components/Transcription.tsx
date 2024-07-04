import React, { useState } from 'react';
import jwtAxios from '../services/jwt-auth';

const Transcription = () => {
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
      console.log("jwtAxios", jwtAxios);
      const response = await jwtAxios.post('/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data.transcription);
    }
  };

  return (
    <div>
      <h2>Transcription</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Transcribe</button>
      <div>{transcription}</div>
    </div>
  );
};

export default Transcription;
