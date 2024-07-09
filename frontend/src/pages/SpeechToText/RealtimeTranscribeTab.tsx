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
import io from "socket.io-client";

// 'http://localhost:5000'
const socket = io(`${process.env.REACT_APP_API_URL}`);

const RealtimeTranscribeTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<any>(null);

  const [translate, setTranslate] = useState("");
  const [transcription, setTranscription] = useState("");
  const [languageTranslate, onChangeLanguageTranslate] = useState("en");

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [recordMode, setRecordMode] = useState<RECORD_MODE>(
    RECORD_MODE.STOP
  );
  const [actionTask, setActionTask] = useState<ACTION_TASK>(
    ACTION_TASK.TRANSCRIBE
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("transcription_result", (data) => {
      setTranscription((prev) => prev + data.text + " ");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("transcription_result");
    };
  }, []);

  const handleChangeRecordMode = (recordMode: RECORD_MODE) => {
    setRecordMode(recordMode);
    if (recordMode === RECORD_MODE.START) {
      startRecording();
    }
    if (recordMode === RECORD_MODE.STOP) {
      mediaRecorder && mediaRecorder.stop();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          socket.emit("audio_stream", event.data);
        }
      };
      recorder.start(250); // Send audio data every 250ms
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Error accessing microphone: ", err);
    }
  };

  // const handleSubmit = async () => {
  //   if (audioBlob) {
  //     setIsLoading(true);
  //     setTranscription("");
  //     const formData = new FormData();
  //     formData.append("audio", audioBlob);
  //     actionTask === ACTION_TASK.TRANSLATE &&
  //       formData.append("targetLanguage", languageTranslate);
  //     try {
  //       const response = await jwtAxios.post("/transcribe", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       if (response?.data) {
  //         setTranscription(response.data.transcription);
  //         response?.data?.translate && setTranslate(response.data.translate);
  //       }
  //     } catch (error: any) {
  //       console.log("error: ", error);
  //       message.error(error?.message || "Something went wrong");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

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
            onChangeOption={onChangeLanguageTranslate}
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
