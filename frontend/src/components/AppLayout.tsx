import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => (
  <>
    <Navbar/>
    <div className='p-5'>
      <Outlet />
    </div>
  </>
);

export default AppLayout;