import React, { useRef, useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import io from "socket.io-client";
import { BsRecordCircle, BsStopFill } from "react-icons/bs";
import { RECORD_MODE } from "src/constants/AppEnum";
import jwtAxios from "src/services/jwt-auth";
import RecordRTC from "recordrtc";

const socket = io("http://localhost:5000"); // Replace with your Flask server URL

const RealtimeTesting: React.FC = () => {
  const [transcription, setTranscription] = useState<string>("");
  const [recordMode, setRecordMode] = useState<RECORD_MODE>(RECORD_MODE.STOP);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<RecordRTC | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WS server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WS server");
    });

    socket.on("transcription", (data) => {
      setTranscription((prev) => prev + " " + data.text);
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
      handleStartRecording();
    }
    if (recordMode === RECORD_MODE.STOP) {
      handleStopRecording();
    }
  };

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new RecordRTC(stream, {
      type: "audio",
      mimeType: "audio/webm",
    });

    recorder.startRecording();
    setMediaRecorder(recorder);

    const interval = setInterval(() => {
      if (mediaRecorder) {
        mediaRecorder.getDataURL((dataURL: any) => {
          console.log("dataURL:", dataURL);

          socket.emit("audio", { audio: dataURL });
        });
      }
    }, 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stopRecording(() => {
        mediaRecorder.getDataURL((dataURL) => {
          socket.emit("audio", { audio: dataURL });
        });
      });
      setMediaRecorder(null);
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
