import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot } from 'firebase/firestore'
import StudentService from './database/studentService'
import { StudentContext } from "./App";
import loadingIcon from './assets/loading-icon.svg';

function LoginPage() {
    
  const btnLblComp = <p className="button-lbl">Check my attendance</p>;
  const loadingComp = <img src={loadingIcon} alt="checking" className="loading-icon"/>;


  const [idInput, setIdInput] = useState("");
  const [studentDoc, setStudentDoc] = useContext(StudentContext);
  const navigate = useNavigate();
  const [notFoundComp, setNotFoundComp] = useState(null);
  const [loginButtonContent, setLoginButtonContent] = useState(btnLblComp);

  const handleIdInput = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setIdInput(value);
      console.log(value)
    }
  }

  function getWindowWidth() {
    const { innerWidth: width, innerHeight: height } = window;
    return width;
  }

  function startButtonLoading() {
    const screenWidth = getWindowWidth();
    const loadingOnly = screenWidth <= 370;

    // set to true so that only the loading is shown
    setLoginButtonContent(<>{true ? null : btnLblComp}{loadingComp}</>);
  }

  function stopButtonLoading() {
    setLoginButtonContent(btnLblComp);
  }

  const handleKeyDown = (e) => {
    const currentValue = e.target.value;

    // Allow control keys: backspace, delete, arrows, etc.
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Tab'
    ) {
      return;
    }

    // Block non-numeric key presses or prevent typing if input already has 6 digits
    if (!/[0-9]/.test(e.key) || currentValue.length >= 6) {
      e.preventDefault();  // Prevent non-numeric keys or excessive input
    }
  };

  const enterKeyPressed = (e) => {
    if(e.key === "Enter")
      handleLogin();
  }

  const handleLogin = async () => {

    if(idInput === "") {
      setNotFoundComp(<p className="not-found-prompt">Please input your ID number</p>);
      return
    };

    startButtonLoading();

    setNotFoundComp(null);

    const newStudentDoc = await StudentService.getStudentByStudentId(idInput);
    setStudentDoc(newStudentDoc);

    if (!newStudentDoc){
      setNotFoundComp(<p className="not-found-prompt">Student not found</p>);
    }


    // try{
    //   const newStudentDoc = await StudentService.getStudentByStudentId(idInput);
    //   setStudentDoc(newStudentDoc);
    // } catch (err){
    //   setNotFoundComp(<p className="not-found-prompt">Student not found</p>);
    // }

    stopButtonLoading();

  }

  useEffect(() => {
    if(studentDoc != null){
      const studentId = studentDoc.data()['student_id'];
      navigate(`/event/${studentId}`);
    }
  }, [studentDoc]);

  return (
      <div className="login-container">
        <div className="login-card">
          <h2 className="tb-label">Student ID</h2>
          <div className="tb-container">
            <input 
              type="text" 
              placeholder="Ex. 137102" 
              onChange={handleIdInput} 
              className="id-number-in" 
              onKeyUp={enterKeyPressed} 
              onKeyDown={handleKeyDown}
              inputMode="numeric"/>
          </div>
          {notFoundComp}
          <button onClick={handleLogin} className="login-button">{loginButtonContent}</button>
        </div>
      </div>
  );
}

export default LoginPage;