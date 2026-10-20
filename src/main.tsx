import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/restored-ui.css'
import './styles/create-idle.css'
import './styles/create-chat.css'
import { hydrateDemoData } from './mock/seed'

hydrateDemoData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
