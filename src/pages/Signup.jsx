import React from 'react'
import axios from "axios"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './sign.css'
import { toast } from 'react-toastify'
import { z } from "zod";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const Signup = ({}) => {
    const [user,setUser] = useState({username:"",email:"",password:"",mobile:""})
    const [error,setError] = useState({username:"",email:"",password:"",mobile:""})
    const [isError,setIsError] = useState({username:false,email:false,password:false,mobile:false})
    
    const navigate = useNavigate()
    let nameSchema = z.string().min(3, "Name must be at least 3 characters").regex(/^[a-z A-Z"]+$/,"Name should only consist of alphabets.");
    let emailSchema = z.string().email("Invalid email address")
    let passwordSchema = z.string().min(4, "Password must be at least 4 characters")
    let mobileSchema = z.coerce.number().int().max(9999999999,"mobile should'nt be greater than 10 digits").min(100000000,"mobile should'nt be less than 10 digits")

  const focusHandler = (name) => {
  if (name === "email" && !user.username) {
    setError((prev) => ({ ...prev, username: "Required field" }));
    setIsError((prev) => ({ ...prev, username: true }));
  }
  if (name === "password") {
    if (!user.username) {
      setError((prev) => ({ ...prev, username: "Required field" }));
      setIsError((prev) => ({ ...prev, username: true }));
    }
    if (!user.email) {
      setError((prev) => ({ ...prev, email: "Required field" }));
      setIsError((prev) => ({ ...prev, email: true }));
    }
    if (!user.password) {
            setError((prev) => ({ ...prev,password: "Required field" }));
            setIsError((prev) => ({ ...prev, password: true }));
          
        }
  }
};

  const changeHandler = (name,val,schema)=>{
      val=val.trim()
      setUser({...user,[name]:val})
      console.log(user)
      let validation = schema.safeParse(val);
      if(!validation.success) {
        setError({...error,[name]:validation.error.issues[0].message})
        setIsError({...isError,[name]:true})
        return;
    }else{
      setIsError({...isError,[name]:false})
      setError({...error,[name]:""})
    }
    return;
  }
  const submitHandler = async(e) => {
    e.preventDefault();
    if(!user.username){
      setError((prev) => ({ ...prev, username: "Required field" }));
      setIsError((prev) => ({ ...prev, username: true }));
      return
    } else if( !user.email ){
        setError((prev) => ({ ...prev, email: "Required field" }));
        setIsError((prev) => ({ ...prev, email: true }));
        return
    }else if(!user.password){
        setError((prev) => ({ ...prev,password: "Required field" }));
        setIsError((prev) => ({ ...prev, password: true }));
        return
    }else if(!user.mobile){
        setError((prev) => ({ ...prev,mobile: "Required field" }));
        setIsError((prev) => ({ ...prev, mobile: true }));  
        return
    }
    try{
        const res = await axios.post('http://localhost:3000/users/sign-up',user)
        console.log("signing up",res.data.message)
        toast.success(res?.data?.message)
        // setUserPresence(true)
        setError({username:"",email:"",password:""})
        setUser({username:"",email:"",password:""})
        console.log(user)
        navigate('/sign-in')
    }catch(e){
        console.log("error while signup",e.response?.data?.error)
        const backendMsg = e.response?.data?.error;
          if (Array.isArray(backendMsg)) {
            backendMsg.forEach(err => toast.error(err.message));
          } else {
            toast.error(backendMsg || e.message);
          }
        return
    }
  }

  return (
    <div className='form'>
      <div className='head'>Sign Up</div>
        <Box className="form-actions" component="form" onSubmit={submitHandler} noValidate>
            <TextField
          required 
          id="outlined-password-input"
          name="username"
          label="Name"
          type="text"
          value={user.username}
          autoComplete="current-password"
          onChange={(e)=>changeHandler(e.target.name,e.target.value,nameSchema)}
          error={isError.username}
          helperText={error.username}
          onFocus={(e)=>focusHandler(e.target.name)}
          />
        <TextField
          required
          id="outlined-password-input"
          name="email"
          label="email"
          type="email"
          value={user.email}
          autoComplete="current-password"
          onChange={(e)=>changeHandler(e.target.name,e.target.value,emailSchema)}
          error={isError.email}
          helperText={error.email}
          onFocus={(e)=>focusHandler(e.target.name)}/>
        <TextField
          required
          id="outlined-password-input"
          name='password'
          label="Password"
          type="password"
          value={user.password}
          autoComplete="current-password"
          onChange={(e)=>changeHandler(e.target.name,e.target.value,passwordSchema)}
          error={isError.password}
          helperText={error.password}
          onFocus={(e)=>focusHandler(e.target.name)}
        />
        <TextField
          required
          id="outlined-password-input"
          name='mobile'
          label="Mobile Number"
          type="number"
          value={user.mobile}
          autoComplete="current-password"
          onChange={(e)=>changeHandler(e.target.name,e.target.value,mobileSchema)}
          error={isError.mobile}
          helperText={error.mobile}
          onFocus={(e)=>focusHandler(e.target.name)}
        />
        <div className="form-button">
          <Button 
            className='button signup-button' 
            variant="contained" 
            disabled={Object.values(isError).filter((el=>el)).length > 0}
            type="submit"
          >SignUp </Button>
        </div>
        </Box>
      </div>
  )
}

export default Signup