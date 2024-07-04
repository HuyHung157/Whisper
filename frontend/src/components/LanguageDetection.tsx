import React, { useState } from 'react';
import jwtAxios from '../services/jwt-auth';

const LanguageDetection = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('');

  const handleSubmit = async () => {
    const response = await jwtAxios.post('/detect_language', { text });
    setLanguage(response.data.language);
  };

  return (
    <div>
      <h2>Language Detection</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)}></textarea>
      <button onClick={handleSubmit}>Detect</button>
      <div>{language}</div>
    </div>
  );
};

export default LanguageDetection;
