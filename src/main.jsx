import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StyledEngineProvider } from '@mui/material/styles';
import {UserProvider} from './context/userContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <UserProvider>
        <App/>
    </UserProvider>
    </StyledEngineProvider>
  </StrictMode>,
)
