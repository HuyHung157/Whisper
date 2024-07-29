import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { MdRecordVoiceOver, MdOutlineTextsms } from "react-icons/md";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import "antd/dist/reset.css";
import "./Navbar.css";
import { APP_ROUTES } from "../../constants/AppEnum";

const { Header } = Layout;

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const path = location.pathname.replace("/", "");
    switch (path) {
      case APP_ROUTES.SPEECH_TO_TEXT:
        setActiveTab(APP_ROUTES.SPEECH_TO_TEXT);
        break;
      // case APP_ROUTES.TEXT_TO_SPEECH:
      //   setActiveTab(APP_ROUTES.TEXT_TO_SPEECH);
      //   break;
      // case APP_ROUTES.FINE_TUNNING:
      //   setActiveTab(APP_ROUTES.FINE_TUNNING);
      //   break;
      default:
        setActiveTab(APP_ROUTES.SPEECH_TO_TEXT);
        break;
    }
  }, [location]);

  const handleClick = (e: any) => {
    setActiveTab(e.key);
  };

  return (
    <Header className="App-header">
      <Menu
        theme="light"
        className=""
        mode="horizontal"
        onClick={handleClick}
        selectedKeys={[activeTab]}
        defaultSelectedKeys={[`${APP_ROUTES.SPEECH_TO_TEXT}`]}
      >
        <Menu.Item
          className="flex align-middle"
          key={APP_ROUTES.SPEECH_TO_TEXT}
          icon={<MdRecordVoiceOver size={20} />}
        >
          <Link to={APP_ROUTES.SPEECH_TO_TEXT}>Speech to Text</Link>
        </Menu.Item>
        {/* <Menu.Item
          className="flex align-middle"
          key={APP_ROUTES.TEXT_TO_SPEECH}
          icon={<MdOutlineTextsms size={20} />}
        >
          <Link to={APP_ROUTES.TEXT_TO_SPEECH}>Text to Speech</Link>
        </Menu.Item>
        <Menu.Item
          className="flex align-middle"
          key={APP_ROUTES.FINE_TUNNING}
          icon={<HiOutlineWrenchScrewdriver size={20} />}
        >
          <Link to={APP_ROUTES.FINE_TUNNING}> Fine-tunning</Link>
        </Menu.Item> */}
      </Menu>
    </Header>
  );
};

export default Navbar;
