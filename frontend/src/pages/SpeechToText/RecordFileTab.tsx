import React, { useEffect, useRef, useState } from "react";
import { Button, Card, message, Select } from "antd";
import { CiMicrophoneOn } from "react-icons/ci";
import "antd/dist/reset.css";
import { Col, Row } from "antd";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import { ACTION_TASK, RECORD_MODE } from "../../constants/AppEnum";
import { BsRecordCircle, BsStopFill } from "react-icons/bs";
import OptionTask from "../../components/OptionTask";
import CustomCard from "../../components/CustomCard";
import { getSingleOption } from "src/utils/language";

const RecordFileTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<any>(null);
  const [audioURL, setAudioURL] = useState("");
  const [translate, setTranslate] = useState("");
  const [transcription, setTranscription] = useState("");
  const [languageTranslate, setLanguageTranslate] = useState("en");
  const [languageDetection, setLanguageDetection] = useState("");
  const [languageOptions, setLanguageOptions] = useState<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordMode, setRecordMode] = useState<RECORD_MODE>(
    RECORD_MODE.DEFAULT
  );
  const [actionTask, setActionTask] = useState<ACTION_TASK>(
    ACTION_TASK.TRANSCRIBE
  );

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

  useEffect(() => {
    const options = getSingleOption(languageDetection);
    if (options && options.length > 0) {
      setLanguageOptions(options);
    }
  }, [languageDetection]);

  const startRecording = async () => {
    try {
      let chunks: any[] = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        console.log("event:: ", event);
        chunks.push(event.data);
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        // const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(url);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone: ", err);
    }
  };

  const handleSubmit = async () => {
    if (audioBlob) {
      setIsLoading(true);
      setTranscription("");
      const formData = new FormData();
      formData.append("audio", audioBlob);
      actionTask === ACTION_TASK.TRANSLATE &&
        formData.append("targetLanguage", languageTranslate);
      try {
        const response = await jwtAxios.post("/transcribe", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response?.data) {
          setTranscription(response.data.transcription);
          response?.data?.translate && setTranslate(response.data.translate);
          response?.data?.language &&
            setLanguageDetection(response.data.language);
        }
      } catch (error: any) {
        console.log("error: ", error);
        message.error(error?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col flex={6}>
          <CustomCard icon={<CiMicrophoneOn size={18} />} label="Microphone">
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
              <div className="flex items-center">
                {!audioURL && <audio controls src={""}></audio>}
                {audioURL && (
                  <audio controls>
                    <source src={audioURL} type="audio/wav" />
                  </audio>
                )}

                <Button
                  className="ml-2"
                  onClick={() => handleChangeRecordMode(RECORD_MODE.DEFAULT)}
                >
                  X
                </Button>
              </div>
            )}
          </CustomCard>

          <OptionTask
            onChangeOption={setLanguageTranslate}
            onChangeTask={setActionTask}
          />
          <Card>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Card>
        </Col>

        <Col flex={6}>
          <CustomCard label="Output:">
            {languageDetection && languageOptions && (
              <>
                Language Detection:
                <Select
                  className="ml-3 min-w-36"
                  options={languageOptions}
                  defaultValue={languageDetection}
                  disabled
                />
                <br />
              </>
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

RecordFileTab.propTypes = {};

export default RecordFileTab;
