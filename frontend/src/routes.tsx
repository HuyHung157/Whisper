import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import SpeechToText from "./pages/SpeechToText";
import Translation from "./pages/Translation";
import Transcription from "./pages/Transcription";
import LanguageDetection from "./pages/LanguageDetection";
import TextToSpeech from "./pages/TextToSpeech";
import Settings from "./pages/Settings";
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
