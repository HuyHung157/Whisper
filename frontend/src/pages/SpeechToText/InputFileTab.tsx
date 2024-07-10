import React, { useEffect, useState } from "react";
import { Button, Card, Col, message, Row, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { BsFileEarmarkMusic } from "react-icons/bs";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import OptionTask from "../../components/OptionTask";
import { ACTION_TASK } from "../../constants/AppEnum";
import CustomCard from "../../components/CustomCard";
import "antd/dist/reset.css";
import { getSingleOption } from "src/utils/language";

const { Dragger } = Upload;

const InputFileTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [translate, setTranslate] = useState("");
  const [transcription, setTranscription] = useState("");
  const [languageTranslate, setLanguageTranslate] = useState("en");
  const [languageDetection, setLanguageDetection] = useState("");
  const [languageOptions, setLanguageOptions] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [actionTask, setActionTask] = useState<ACTION_TASK>(
    ACTION_TASK.TRANSCRIBE
  );

  const handleSubmit = async () => {
    if (audioFile) {
      setIsLoading(true);
      setTranscription("");
      setLanguageDetection("");
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

  useEffect(() => {
    const options = getSingleOption(languageDetection);
    if (options && options.length > 0) {
      setLanguageOptions(options);
    }
  }, [languageDetection]);

  return (
    <>
      <Row gutter={24}>
        <Col flex={6}>
          <CustomCard icon={<BsFileEarmarkMusic size={18} />} label="Input">
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

// InputFileTab.propTypes = {
//   handleSubmit: PropTypes.func,
// };

export default InputFileTab;
