import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => (
  <>
    <Navbar/>
    <Outlet />
  </>
);

export default AppLayout;