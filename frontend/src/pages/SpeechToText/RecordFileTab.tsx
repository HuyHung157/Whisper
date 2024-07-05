import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Card } from "antd";

import "antd/dist/reset.css";
import { Col, Row } from "antd";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import { RECORD_MODE } from "../../constants/AppEnum";
import { BsRecordCircle, BsStopFill } from "react-icons/bs";
import OptionTask from "../../components/OptionTask";

const RecordFileTab = () => {
  const [transcription, setTranscription] = useState("");
  const [audioBlob, setAudioBlob] = useState<any>(null);
  const [audioURL, setAudioURL] = useState("");
  const [recordMode, setRecordMode] = useState<RECORD_MODE>(
    RECORD_MODE.DEFAULT
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleChangeRecordMode = (recordMode: RECORD_MODE) => {
    setRecordMode(recordMode);
    if (recordMode === RECORD_MODE.START) {
      startRecording();
    }
    if (recordMode === RECORD_MODE.STOP) {
      mediaRecorderRef.current && mediaRecorderRef.current.stop();
    } else {
      setAudioURL("");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        console.log("audioBlob: ", audioBlob);
        
        setAudioURL(url);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone: ", err);
    }
  };

  const onChangeTask = (value: any) => {
    console.log("radio checked", value);
  };

  const handleSubmit = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      try {
        const response = await jwtAxios.post("/transcribe", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response?.data) {
          setTranscription(response.data.transcription);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col flex={6}>
          <Card>
            Microphone <br />
            {recordMode === RECORD_MODE.DEFAULT && (
              <Button
                className="sm secondary"
                onClick={() => handleChangeRecordMode(RECORD_MODE.START)}
              >
                <BsRecordCircle color="red" />
                Record from microphone
              </Button>
            )}
            {recordMode === RECORD_MODE.START && (
              <Button
                className="sm secondary"
                onClick={() => handleChangeRecordMode(RECORD_MODE.STOP)}
              >
                <BsStopFill className="breathing-icon" color="red" />
                Stop recording...
              </Button>
            )}
            {recordMode === RECORD_MODE.STOP && (
              <>
                <Button
                  onClick={() => handleChangeRecordMode(RECORD_MODE.DEFAULT)}
                >
                  X
                </Button>

                {!audioURL && <audio controls src={""}></audio>}
                {audioURL && (
                  <audio controls>
                    <source src={audioURL} type="audio/wav" />
                  </audio>
                )}
              </>
            )}
          </Card>
          <OptionTask onChangeTask={onChangeTask} />
          <Card>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Card>
        </Col>

        <Col flex={6}>
          <Card>
            Output:
            <TypingAnimation message={transcription} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

RecordFileTab.propTypes = {};

export default RecordFileTab;
