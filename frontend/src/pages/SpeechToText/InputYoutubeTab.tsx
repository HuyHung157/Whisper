import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, message, Select } from "antd";
import "antd/dist/reset.css";
import { Col, Row } from "antd";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import TextArea from "antd/es/input/TextArea";
import OptionTask from "../../components/OptionTask";
import { ACTION_TASK } from "../../constants/AppEnum";
import CustomCard from "../../components/CustomCard";
import { ImYoutube2 } from "react-icons/im";
import { getSingleOption } from "src/utils/language";

const InputYoutubeTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [translate, setTranslate] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcription, setTranscription] = useState("");
  const [languageTranslate, setLanguageTranslate] = useState("en");
  const [languageDetection, setLanguageDetection] = useState("");
  const [languageOptions, setLanguageOptions] = useState<any>(null);
  const [actionTask, setActionTask] = useState<ACTION_TASK>(
    ACTION_TASK.TRANSCRIBE
  );

  useEffect(() => {
    const options = getSingleOption(languageDetection);
    if (options && options.length > 0) {
      setLanguageOptions(options);
    }
  }, [languageDetection]);

  const handleSubmit = async () => {
    if (youtubeUrl) {
      setIsLoading(true);
      setTranscription("");
      const payload: { youtubeUrl: string; targetLanguage?: string } = {
        youtubeUrl,
      };
      if (actionTask === ACTION_TASK.TRANSLATE && languageTranslate) {
        payload.targetLanguage = languageTranslate;
      }
      try {
        const response = await jwtAxios.post("/transcript-youtube", payload);
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
          <CustomCard icon={<ImYoutube2 size={32} />} label="URL">
            <TextArea
              onChange={(e) => {
                setYoutubeUrl(e.target.value);
              }}
              autoSize={{ minRows: 4 }}
              placeholder="Paste the URL to a YouTube video here"
            />
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
            {transcription && (
              <video width="400" controls>
                <source src={youtubeUrl} />
              </video>
            )}
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
            <TypingAnimation
              isLoading={isLoading}
              message={transcription}
              speed={1}
            />
            {actionTask === ACTION_TASK.TRANSLATE && (
              <>
                Translate:
                <TypingAnimation
                  isLoading={isLoading}
                  message={translate}
                  speed={1}
                />
              </>
            )}
          </CustomCard>
        </Col>
      </Row>
    </>
  );
};

InputYoutubeTab.propTypes = {};

export default InputYoutubeTab;
