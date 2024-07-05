import React, { useState } from "react";
import { Button, Card, Tabs } from "antd";
import "antd/dist/reset.css";
import { BsRecordCircle, BsStopFill } from "react-icons/bs";
import { RECORD_MODE } from "../../constants/AppEnum";
import InputFileTab from "./InputFileTab";
import RecordFileTab from "./RecordFileTab";
import InputYoutubeTab from "./InputYoutubeTab";

const { TabPane } = Tabs;

const Transcription = () => {
  const [audioMicrophone, setAudioMicrophone] = useState<File | null>(null);
  const [recordMode, setRecordMode] = useState<RECORD_MODE>(
    RECORD_MODE.DEFAULT
  );


  const handleChangeRecordMode = (recordMode: RECORD_MODE) => {
    setRecordMode(recordMode);
  };

  return (
    <div className="pt-2 app__container">
      <h2>Transcription</h2>
      <Tabs defaultActiveKey="1" type="card" size="large">
        <TabPane tab="Audio file" key="1">
          <InputFileTab />
        </TabPane>
        <TabPane tab="Microphone" key="2">
          <RecordFileTab />
        </TabPane>
        <TabPane tab="Youtube" key="3">
          <InputYoutubeTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Transcription;
