import React from "react";
import UploadForm from "./components/UploadForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  // return 할 때 제일 최상 태그는 하나만 가능
  return (
  <div>
      <ToastContainer /> 
      <h2>사진첩</h2>
      <UploadForm />
  </div>
  );
};

export default App;
