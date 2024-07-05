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

const { Dragger } = Upload;

const InputFileTab = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");

  const onChangeTask = (value: any) => {
    console.log('radio checked', value);
  };

  const handleSubmit = async () => {
    if (audioFile) {
      const formData = new FormData();
      formData.append("audio", audioFile);
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
            <div style={{ padding: "20px", maxWidth: "400px" }}>
              <Dragger
                beforeUpload={(file) => {
                  setAudioFile(file);
                  return false;
                }}
                accept={"audio/*"}
                style={{ padding: "20px" }}
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

// InputFileTab.propTypes = {
//   handleSubmit: PropTypes.func,
// };

export default InputFileTab;
