import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import SpeechToText from "./pages/SpeechToText";
import LanguageDetection from "./pages/LanguageDetection";
import TextToSpeech from "./pages/TextToSpeech";
import AppLayout from "./components/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <SpeechToText />,
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
    ],
  },
]);
