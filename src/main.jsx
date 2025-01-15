import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/EventPage.css'
import './styles/LoginPage.css'
import './styles/StudentManagerPage.css'
import MainDatabase from './database/database.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
