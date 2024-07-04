import React, { useState } from 'react';
import jwtAxios from '../services/jwt-auth';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [audio, setAudio] = useState('');

  const handleSubmit = async () => {
    const response = await jwtAxios.post('/text_to_speech', { text });
    setAudio(response.data.audio);
  };

  return (
    <div>
      <h2>Text to Speech</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)}></textarea>
      <button onClick={handleSubmit}>Convert</button>
      <audio controls src={audio}></audio>
    </div>
  );
};

export default TextToSpeech;
