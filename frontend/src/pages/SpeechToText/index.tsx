import React from "react";
import { Tabs } from "antd";
import "antd/dist/reset.css";
import InputFileTab from "./InputFileTab";
import RecordFileTab from "./RecordFileTab";
import InputYoutubeTab from "./InputYoutubeTab";
import "./index.css";
import RealtimeTranscribeTab from "./RealtimeTranscribeTab";

const { TabPane } = Tabs;

const Transcription = () => {

  return (
    <div className="pt-2 app__container">
      <h2>Speech To Text</h2>
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
        <TabPane tab="Realtime" key="4">
          <RealtimeTranscribeTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Transcription;
