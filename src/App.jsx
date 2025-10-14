import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'

function App() {
  
  const [isSignedIn, setIsSignedIn] = useState(false)
  console.log("from app",isSignedIn)
  
  return (
    <Router>
      <Navbar userPresent={isSignedIn} setUserPresence={setIsSignedIn}/>
      <Routes>
        <Route path='/sign-up' element={<Signup userPresent={isSignedIn} setUserPresence={setIsSignedIn}/>}/>
        <Route path='/sign-in' element={<Signin userPresent={isSignedIn} setUserPresence={setIsSignedIn}/>}/>
      </Routes>
      <ToastContainer/>
    </Router>
  )
}

export default App
