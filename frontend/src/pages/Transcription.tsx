import React, { useState } from "react";
import jwtAxios from "../services/jwt-auth";
import { Button, Card, Tabs } from "antd";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { Col, Divider, Row } from "antd";
import TextArea from "antd/es/input/TextArea";

const { TabPane } = Tabs;
const { Dragger } = Upload;

const Transcription = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");

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
    <div>
      Transcription
      <Tabs defaultActiveKey="1" type="card" size="large">
        <TabPane tab="Audio file" key="1">
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
                      <br/> - or - <br/>
                      Click to Upload
                    </p>
                    {/* <p className="ant-upload-hint">
                      Support for a single or bulk upload. Only accept MP3 or
                      WAV files.
                    </p> */}
                  </Dragger>
                </div>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Card>
            </Col>

            <Col flex={6}>
              <Card>
                Output:
                <TextArea rows={4} value={transcription} />
                {/* <div>{transcription}</div> */}
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Microphone" key="2">
          Microphone
          {/* <video controls autoplay name="media"/> */}
        </TabPane>
        <TabPane tab="Youtube" key="3">
          Youtube
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Transcription;
