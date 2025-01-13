import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import codesLogo from './assets/codes_logo.png'
import backIcon from './assets/arrow-left-s-line-white.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'
import EventPage from './EventPage'
import LoginPage from './LoginPage'
import MainDatabase from './database/database'

export const StudentContext = React.createContext();

function Header({backButtonRoute, clearStudent}){

  const navigate = useNavigate();
  const hasBackButton = backButtonRoute && clearStudent;
  
  function logoutFunc() {
    clearStudent();
    navigate('/');
  }

  const backButton = hasBackButton ? <img src={backIcon} alt='back' onClick={logoutFunc} className='back-button'></img> : <></>

  const backButtonComp = (
    <div className='header-logo'>
      {backButton}
      {/* <img src={codesLogo} alt="codes logo" className='codes-logo'/> */}
    </div>
  );

  const headerStyle = hasBackButton ? {justifyContent: 'space-between'} : {justifyContent: 'space-around'}

  return(
    <div className='header' style={headerStyle}>
      {hasBackButton ? backButtonComp : null}

      <div style={{display: 'flex'}}>
        {/* <img src={codesLogo} alt="codes logo" className='codes-logo'/> */}
        <h1 className='header-title'>CheckGa! CHECKER</h1>
      </div>


      <div>
        <img src={codesLogo} alt="info" className='codes-logo'/>
      </div>
    </div>
  )
}

function App() {

  const [student, setStudent] = useState(null);

  function clearStudent(){
    setStudent(null);
  }

  return (
    <>
    <StudentContext.Provider value = {[student, setStudent]}>
      <Router>
        <Routes>
          <Route exact path='/' element={<Header/>}/>
          <Route exact path='/event/:id' element={<Header backButtonRoute={'/'} clearStudent={clearStudent}/>}/>
        </Routes>
        <div className='content-div'>
          <Routes>
            <Route exact path='/' element={<LoginPage/>}/>
            <Route exact path='/event/:id' element={<EventPage/>}/>
          </Routes>
        </div>
      </Router>
    </StudentContext.Provider>
    </>
  )
}

export default App
