import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, Radio, RadioChangeEvent } from "antd";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { Col, Row } from "antd";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import OptionTask from "../../components/OptionTask";
import { ACTION_TASK } from "../../constants/AppEnum";

const { Dragger } = Upload;

const InputFileTab = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");
  const [translate, setTranslate] = useState("");
  const [languageTranslate, onChangeLanguageTranslate] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [actionTask, setActionTask] = useState<ACTION_TASK>(
    ACTION_TASK.TRANSCRIBE
  );

  const handleSubmit = async () => {
    if (audioFile) {
      setIsLoading(true);
      setTranscription("");
      const formData = new FormData();
      formData.append("audio", audioFile);
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
        }
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col flex={6}>
          <Card>
            <div style={{ padding: "20px", maxWidth: "400px" }}>
              <Dragger
                beforeUpload={(file) => {
                  console.log("file: ", file);
                  setAudioFile(file);
                  return false;
                }}
                accept={"audio/*"}
                style={{ padding: "20px" }}
                multiple={false}
                maxCount={1}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Drop Audio Here
                  <br /> - or - <br />
                  Click to Upload
                </p>
                {/* <p className="ant-upload-hint">
                      Support for a single or bulk upload. Only accept MP3 or
                      WAV files.
                    </p> */}
              </Dragger>
            </div>
          </Card>
          <OptionTask
            onChangeOption={onChangeLanguageTranslate}
            onChangeTask={setActionTask}
          />
          <Card>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Card>
        </Col>

        <Col flex={6}>
          <Card>
            Output:
            {actionTask === ACTION_TASK.TRANSLATE && (
              <>
                <br /> Transcribe:
              </>
            )}
            <TypingAnimation isLoading={isLoading} message={transcription} />
            {actionTask === ACTION_TASK.TRANSLATE && (
              <>
                Translate:
                <TypingAnimation isLoading={isLoading} message={translate} />
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

// InputFileTab.propTypes = {
//   handleSubmit: PropTypes.func,
// };

export default InputFileTab;
