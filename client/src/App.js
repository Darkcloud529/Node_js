import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import { Switch, Route } from "react-router-dom";

const App = () => {
  // return 할 때 제일 최상 태그는 하나만 가능
  return (
    <div style={{maxWidth: 600, margin: "auto"}}>
        <ToastContainer /> 
        <Switch>
            <Route path="/" component={MainPage} />
            <Route path="/auth/register" component={RegisterPage} />
            <Route path="/auth/login" component={LoginPage} />
        </Switch>
    </div>
  );
};

export default App;
