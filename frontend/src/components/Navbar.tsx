import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { MdOutlineFindInPage, MdRecordVoiceOver, MdTextsms } from "react-icons/md";
import "antd/dist/reset.css";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header className="App-header">
      <div className="logo" />
      <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="2" icon={<MdRecordVoiceOver />}>
          <Link to="/speech-to-text">Speech to Text</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<MdTextsms />}>
          <Link to="/text-to-speech">Text to Speech</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<MdOutlineFindInPage />}>
          <Link to="/detect-language">Language Detection</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
