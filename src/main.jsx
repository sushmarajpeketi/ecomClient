import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StyledEngineProvider } from '@mui/material/styles';
import {UserProvider} from './context/userContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>

    
    <StyledEngineProvider injectFirst>
      <UserProvider>
        <App/>
    </UserProvider>
    </StyledEngineProvider>
    </Router>
  </StrictMode>,
)
