import React, { useState } from "react";
import codesLogo from "./assets/codes_logo.png";
import backIcon from "./assets/arrow-left-s-line-white.svg";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import EventPage from "./EventPage";
import LoginPage from "./LoginPage";

export const StudentContext = React.createContext();

// eslint-disable-next-line react/prop-types
function Header({ backButtonRoute, clearStudent }) {
  const navigate = useNavigate();
  const hasBackButton = backButtonRoute && clearStudent;

  function logoutFunc() {
    clearStudent();
    navigate("/");
  }

  const backButton = hasBackButton ? (
    <img
      src={backIcon}
      alt="back"
      onClick={logoutFunc}
      className="back-button"
    ></img>
  ) : (
    <></>
  );

  const backButtonComp = <div className="w-8 h-8">{backButton}</div>;

  return (
    <div className="border-b border-b-[#1d1d1d]">
      <div className="container flex items-center gap-4 py-4 mx-auto ">
        {hasBackButton ? backButtonComp : null}
        <img className="w-10 aspect-auto" src={codesLogo} alt="info" />
        <h1 className="text-lg font-bold">CheckGa! Checker</h1>
      </div>
    </div>
  );
}

function App() {
  const [student, setStudent] = useState(null);

  function clearStudent() {
    setStudent(null);
  }

  return (
    <>
      <div className="text-white bg-[#080808] h-screen flex flex-col">
        <StudentContext.Provider value={[student, setStudent]}>
          <Router>
            <Routes>
              <Route exact path="/" element={<Header />} />
              <Route
                exact
                path="/event/:id"
                element={
                  <Header backButtonRoute={"/"} clearStudent={clearStudent} />
                }
              />
            </Routes>
            <Routes>
              <Route exact path="/" element={<LoginPage />} />
              <Route exact path="/event/:id" element={<EventPage />} />
            </Routes>
          </Router>
        </StudentContext.Provider>
      </div>
    </>
  );
}

export default App;
