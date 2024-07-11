import React, { useRef, useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import io from "socket.io-client";
import { BsRecordCircle, BsStopFill } from "react-icons/bs";
import { RECORD_MODE } from "src/constants/AppEnum";
import jwtAxios from "src/services/jwt-auth";

const socket = io("http://127.0.0.1:5000"); // Replace with your Flask server URL

const RealtimeTesting: React.FC = () => {
  const [transcription, setTranscription] = useState<string>("");
  const [recordMode, setRecordMode] = useState<RECORD_MODE>(RECORD_MODE.STOP);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WS server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WS server");
    });

    socket.on("transcription_result", (data: any) => {
      setTranscription((prev) => prev + data.text + " ");
    });

    getListDevice();
    return () => {
      // socket.disconnect();
    };
  }, []);

  const getListDevice = async () => {
    const response = await jwtAxios.get("/list-sound-device");
    console.log("response: ", response);
  };

  const handleChangeRecordMode = (recordMode: RECORD_MODE) => {
    setRecordMode(recordMode);
    if (recordMode === RECORD_MODE.START) {
      startRecording();
    }
    if (recordMode === RECORD_MODE.STOP) {
      stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);

            // Process the audio data immediately or accumulate until stop
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    const audioBuffer = reader.result as ArrayBuffer;

                    // Optionally, you may encode ArrayBuffer to base64 if needed
                    // const base64Encoded = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

                    // Emit the audio data to the backend via Socket.IO
                    socket.emit('audio_stream', audioBuffer);
                }
            };
            reader.readAsArrayBuffer(audioBlob);
        };

        mediaRecorderRef.current.start(1000); // Capture audio every second

      console.log("Recording started");
  } catch (error) {
      console.error('Error starting recording', error);
  }
};

const stopRecording = async () => {
    try {
      mediaRecorderRef.current?.stop();
    } catch (error) {
        console.error('Error stopping recording', error);
    }
};

  return (
    <div className="App">
      {recordMode === RECORD_MODE.STOP && (
        <Button
          className="sm secondary"
          onClick={() => handleChangeRecordMode(RECORD_MODE.START)}
        >
          <BsRecordCircle color="red" />
          Start speaking
        </Button>
      )}
      {recordMode === RECORD_MODE.START && (
        <Button
          className="sm secondary"
          onClick={() => handleChangeRecordMode(RECORD_MODE.STOP)}
        >
          <BsStopFill className="breathing-icon" color="red" />
          Stop speaking...
        </Button>
      )}
      <Input.TextArea
        autoSize={{ minRows: 10 }}
        value={transcription}
        disabled
      />
    </div>
  );
};

export default RealtimeTesting;
