import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, Radio, RadioChangeEvent } from "antd";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { Col, Row } from "antd";
import TypingAnimation from "../../components/TypingAnimation";
import jwtAxios from "../../services/jwt-auth";
import { RECORD_MODE } from "../../constants/AppEnum";
import { BsRecordCircle, BsStopFill } from "react-icons/bs";
import TextArea from "antd/es/input/TextArea";
import OptionTask from "../../components/OptionTask";

const options = [
  { label: 'Transcribe', value: 'transcribe' },
  { label: 'Translate', value: 'translate' },
];

const InputYoutubeTab = () => {
  const [transcription, setTranscription] = useState("");
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

InputYoutubeTab.propTypes = {};

export default InputYoutubeTab;
