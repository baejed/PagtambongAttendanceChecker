import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentService from "./database/studentService";
import { StudentContext } from "./App";
import loadingIcon from "./assets/loading-icon.svg";

function LoginPage() {
  const [idInput, setIdInput] = useState("");
  const [studentDoc, setStudentDoc] = useContext(StudentContext);
  const navigate = useNavigate();
  const [notFoundComp, setNotFoundComp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIdInput = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setIdInput(value);
      console.log(value);
    }
  };

  const handleKeyDown = (e) => {
    const currentValue = e.target.value;

    // Allow control keys: backspace, delete, arrows, etc.
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Tab"
    ) {
      return;
    }

    // Block non-numeric key presses or prevent typing if input already has 6 digits
    if (!/[0-9]/.test(e.key) || currentValue.length >= 6) {
      e.preventDefault(); // Prevent non-numeric keys or excessive input
    }
  };

  const enterKeyPressed = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleLogin = async () => {
    if (idInput === "") {
      setNotFoundComp(
        <p className="not-found-prompt">Please input your ID number</p>
      );
      return;
    }

    setIsLoading(() => true);

    setNotFoundComp(null);
    try {
      const newStudentDoc = await StudentService.getStudentByStudentId(idInput);
      setStudentDoc(newStudentDoc);
    } catch (err) {
      setNotFoundComp(<p className="not-found-prompt">Student not found</p>);
    }
    setIsLoading(() => false);
  };

  useEffect(() => {
    if (studentDoc != null) {
      const studentId = studentDoc.data()["student_id"];
      navigate(`/event/${studentId}`);
    }
  }, [studentDoc]);

  return (
    <div className="container grid h-full mx-auto place-items-center">
      <div className="max-w-md p-6 bg-[#1c1c1e] border border-[#242426] rounded-lg shadow ">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Student Attendance Checker</h1>
          <p className="text-[#9ca3af]">
            Enter your student ID to view your attendance history.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label className="font-medium ">Student ID</label>
            <input
              type="text"
              className="border text-sm rounded-md lock w-full px-4 py-2 bg-[#1c1c1e] border-gray-600 placeholder-gray-400 text-white focus:ring-white-500 focus:border-white-500"
              placeholder="Ex. 137102"
              onChange={handleIdInput}
              onKeyUp={enterKeyPressed}
              onKeyDown={handleKeyDown}
              inputMode="numeric"
            />
          </div>
          <span className="text-red-500">{notFoundComp}</span>

          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-[#146ef5] rounded-md w-full text-center mx-auto grid place-items-center hover:bg-blue-700  transition-all"
          >
            {isLoading ? (
              <img
                src={loadingIcon}
                alt="checking"
                className="w-6 h-6 max-w-full text-center"
              />
            ) : (
              "Check my attendance"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
