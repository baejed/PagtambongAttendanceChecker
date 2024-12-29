import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import EventPage from './EventPage'
import LoginPage from './LoginPage'

export const StudentContext = React.createContext();

function App() {

  const [student, setStudent] = useState(null);

  return (
    <>
    <StudentContext.Provider value = {[student, setStudent]}>
      <Router>
        <Routes>
          <Route exact path='/' element={<LoginPage/>}/>
          <Route exact path='/event/:id' element={<EventPage/>}/>
        </Routes>
      </Router>
    </StudentContext.Provider>
    </>
  )
}

export default App
