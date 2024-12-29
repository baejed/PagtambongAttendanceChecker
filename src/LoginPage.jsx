import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot } from 'firebase/firestore'
import StudentService from './database/studentService'
import { StudentContext } from "./App";

function LoginPage() {
    
  const [idInput, setIdInput] = useState("");
  const [studentDoc, setStudentDoc] = useContext(StudentContext);
  const navigate = useNavigate();

  const handleIdInput = (e) => {
    setIdInput(e.target.value);
  }

  const handleLogin = async () => {
    const newStudentDoc = await StudentService.getStudentByStudentId(idInput);
    setStudentDoc(newStudentDoc);
  }

  useEffect(() => {
    if(studentDoc != null){
      const studentId = studentDoc.data()['student_id'];
      navigate(`/event/${studentId}`);
    }
  }, [studentDoc]);

  return (
      <div>
        <input type="text" placeholder="ID number" onChange={handleIdInput}/>
        <button onClick={handleLogin}>Login</button>
      </div>
  );
}

export default LoginPage;