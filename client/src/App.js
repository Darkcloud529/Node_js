import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const App = () => {
  // return 할 때 제일 최상 태그는 하나만 가능
  return (
    <div style={{maxWidth: 600, margin: "auto"}}>
        <ToastContainer /> 
        <BrowserRouter>
          <Routes>
              <Route path="/auth/register" element={<RegisterPage/>} />
              <Route path="/auth/login" element={<LoginPage/>} />
              <Route path="/" element={<MainPage/>} />
          </Routes>
        </BrowserRouter>
    </div>
  );
};

export default App;
