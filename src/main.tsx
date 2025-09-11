import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import './styles/tokens.css';
import "primereact/resources/themes/lara-light-blue/theme.css"; // tema
import "primereact/resources/primereact.min.css";              // core css
import "primeicons/primeicons.css";                            // ícones
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </StrictMode>,
)
