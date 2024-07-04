import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/transcription">Transcription</Link></li>
        <li><Link to="/translation">Translation</Link></li>
        <li><Link to="/speech-to-text">Speech to Text</Link></li>
        <li><Link to="/text-to-speech">Text to Speech</Link></li>
        <li><Link to="/detect-language">Language Detection</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
