import { Outlet } from "react-router-dom";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header user="Ina Yoon" />
      <Outlet />
    </>
  );
}

export default App;
