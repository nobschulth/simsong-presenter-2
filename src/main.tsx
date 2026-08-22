import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./App.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App className="app" />
    <div className="rotate-message">Please rotate your phone!</div>
  </StrictMode>,
)
