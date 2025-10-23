import React,{useContext} from 'react'
import { userContext } from '../context/userContext'
import { Navigate ,Outlet} from 'react-router-dom'

const RoleProtectedRoute = ({allowedRoles}) => {
    const {user,setUser} = useContext(userContext)
    if(!user) return <Navigate to='/sign-in' replace/>
    console.log("user role is",user.role)
  return (
    allowedRoles.includes(user.role)
    ? 
    <Outlet />

    : <Navigate to="/unauthorized" replace />
  )
}

export default RoleProtectedRoute