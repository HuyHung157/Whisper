import React, { useEffect, useRef, useState } from "react";
import { Button, Card, message } from "antd";
import { CiMicrophoneOn } from "react-icons/ci";
import "antd/dist/reset.css";
import { Col, Row } from "antd";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import { ACTION_TASK, RECORD_MODE } from "../../constants/AppEnum";
import { BsRecordCircle, BsStopFill } from "react-icons/bs";
import OptionTask from "../../components/OptionTask";
import CustomCard from "../../components/CustomCard";
import { Socket, io } from "socket.io-client";

// 'http://localhost:5000'
const socket = io(`${process.env.REACT_APP_API_URL}`);
const newSocket = io(`${process.env.REACT_APP__WS_SERVER_URL}`, {
  reconnection: true,
  reconnectionAttempts: Number(
    process.env.REACT_APP__WS_MAX_RECONNECT_ATTEMPTS
  ),
  timeout: Number(process.env.REACT_APP__WS_TIMEOUT), // 10 seconds timeout for reconnect attempts
});

const RealtimeTranscribeTab = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<any>(null);

  const [translate, setTranslate] = useState("");
  const [transcription, setTranscription] = useState("");
  const [languageTranslate, setLanguageTranslate] = useState("en");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [recordMode, setRecordMode] = useState<RECORD_MODE>(RECORD_MODE.STOP);
  const [actionTask, setActionTask] = useState<ACTION_TASK>(
    ACTION_TASK.TRANSCRIBE
  );

  useEffect(() => {
    newSocket.on("connect", () => {
      console.log("Connected to WS server");
      setSocket(newSocket);
      setReconnectAttempts(0);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WS server");
    });

    newSocket.on("transcription_result", (data: any) => {
      setTranscription((prev) => prev + data.text + " ");
    });

    newSocket.on(
      "audio_response",
      (data: { transcription?: string; error?: string }) => {
        if (data.transcription) {
          console.log("Transcription:", data.transcription);
          // Handle transcription response here (update UI, etc.)
          message.info(data.transcription);
        } else if (data.error) {
          console.error("Error:", data.error);
          // Handle error response (display error message, etc.)
          message.error("Error occurred during transcription");
        }
      }
    );

    newSocket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
      setReconnectAttempts((prevAttempts) => prevAttempts + 1);
    });

    newSocket.on("reconnect_failed", () => {
      console.log("Reconnection attempts exhausted.");
      setReconnectAttempts(0);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

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
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          event.data.arrayBuffer().then((buffer) => {
            console.log("buffer: ", buffer);
            newSocket.emit("audio_stream", buffer);
          });
        }
      };

      mediaRecorder.start(250); // Send audio chunks every 250ms
      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col flex={6}>
          <CustomCard icon={<CiMicrophoneOn size={18} />} label="Realtime">
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
          </CustomCard>

          <OptionTask
            onChangeOption={setLanguageTranslate}
            onChangeTask={setActionTask}
          />
          {/* <Card>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Card> */}
        </Col>

        <Col flex={6}>
          <CustomCard label="Output:">
            {reconnectAttempts > 0 && (
              <p className="mt-4">
                Reconnecting ({reconnectAttempts} /{" "}
                {process.env.REACT_APP__WS_MAX_RECONNECT_ATTEMPTS})
              </p>
            )}
            Transcribe:
            <TypingAnimation isLoading={isLoading} message={transcription} />
            {actionTask === ACTION_TASK.TRANSLATE && (
              <>
                Translate:
                <TypingAnimation isLoading={isLoading} message={translate} />
              </>
            )}
          </CustomCard>
        </Col>
      </Row>
    </>
  );
};

export default RealtimeTranscribeTab;
