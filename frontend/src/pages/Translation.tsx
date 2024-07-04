import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtAxios from "../services/jwt-auth";

const Translation = () => {
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>(
    []
  );
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await axios.get("/languages.json");
      setLanguages(response.data);
    };

    fetchLanguages();
  }, []);

  const handleTranslate = async () => {
    try {
      const response = await jwtAxios.post("/translate", {
        text,
        target_lang: targetLang,
      });
      if (response?.data) {
        setTranslation(response.data.translation);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div>
      <h2>Translation</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <select
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      >
        <option value="">Select a language</option>
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
      <button onClick={handleTranslate}>Translate</button>
      <div>
        <h3>Translation</h3>
        <p>{translation}</p>
      </div>
    </div>
  );
};

export default Translation;
