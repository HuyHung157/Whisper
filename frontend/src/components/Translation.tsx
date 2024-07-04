import React, { useState } from 'react';
import jwtAxios from '../services/jwt-auth';

const Translation = () => {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [translation, setTranslation] = useState('');

  const handleSubmit = async () => {
    const response = await jwtAxios.post('/translate', { text, target_lang: targetLang });
    setTranslation(response.data.translation);
  };

  return (
    <div>
      <h2>Translation</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)}></textarea>
      <input
        type="text"
        placeholder="Target Language"
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      />
      <button onClick={handleSubmit}>Translate</button>
      <div>{translation}</div>
    </div>
  );
};

export default Translation;
