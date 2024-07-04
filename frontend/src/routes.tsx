import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import SpeechToText from "./components/SpeechToText";
import Translation from "./components/Translation";
import Transcription from "./components/Transcription";
import LanguageDetection from "./components/LanguageDetection";
import TextToSpeech from "./components/TextToSpeech";
import Settings from "./components/Settings";
import AppLayout from "./components/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Transcription />,
      },
      {
        path: "transcription",
        element: <Transcription />,
      },
      {
        path: "translation",
        element: <Translation />,
      },
      {
        path: "speech-to-text",
        element: <SpeechToText />,
      },
      {
        path: "text-to-speech",
        element: <TextToSpeech />,
      },
      {
        path: "detect-language",
        element: <LanguageDetection />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
