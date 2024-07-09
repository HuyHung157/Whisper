import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, message } from "antd";
import "antd/dist/reset.css";
import { Col, Row } from "antd";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import TextArea from "antd/es/input/TextArea";
import OptionTask from "../../components/OptionTask";
import { ACTION_TASK } from "../../constants/AppEnum";
import CustomCard from "../../components/CustomCard";
import { ImYoutube2 } from "react-icons/im";

const InputYoutubeTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [translate, setTranslate] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcription, setTranscription] = useState("");
  const [languageTranslate, onChangeLanguageTranslate] = useState("en");
  const [actionTask, setActionTask] = useState<ACTION_TASK>(
    ACTION_TASK.TRANSCRIBE
  );

  const handleSubmit = async () => {
    if (youtubeUrl) {
      setIsLoading(true);
      setTranscription("");
      try {
        const response = await jwtAxios.post("/transcript-youtube", {
          youtubeUrl,
          targetLanguage: languageTranslate,
        });
        if (response?.data) {
          setTranscription(response.data.transcription);
          response?.data?.translate && setTranslate(response.data.translate);
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
          <CustomCard label="Output:">
            {transcription && (
              <video width="400" controls>
                <source src={youtubeUrl} />
              </video>
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
