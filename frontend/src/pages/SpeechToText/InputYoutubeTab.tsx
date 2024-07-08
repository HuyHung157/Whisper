import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Card } from "antd";
import "antd/dist/reset.css";
import { Col, Row } from "antd";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import TextArea from "antd/es/input/TextArea";
import OptionTask from "../../components/OptionTask";

const InputYoutubeTab = () => {
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageTranslate, onChangeLanguageTranslate] = useState("en");
  const handleSubmit = async () => {};

  const onChangeTask = ( value: any ) => {
    console.log('radio1 checked', value);
  };

  return (
    <>
      <Row gutter={24}>
        <Col flex={6}>
          <Card>
            YouTube URL <br />
            <TextArea placeholder="Paste the URL to a YouTube video here" />
          </Card>
          <OptionTask onChangeOption={onChangeLanguageTranslate} onChangeTask={onChangeTask} />
          <Card>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Card>
        </Col>

        <Col flex={6}>
          <Card>
            Output:
            <TypingAnimation isLoading={isLoading} message={transcription} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

InputYoutubeTab.propTypes = {};

export default InputYoutubeTab;
