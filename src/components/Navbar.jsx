import "./navbar.css";
import { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import { Link } from "react-router-dom";
import {
  Avatar,
  IconButton,
  Drawer,
} from "@mui/material";

import UserProfile from "./Users/UserProfile";

const Navbar = () => {
  const { user, setUser } = useContext(userContext);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (val) => {
    console.log("toggle drawer is ",val)
    setOpen(!val);
  };

  return (
    <div className="nav-container">
      <div className="nav">
        <p>E-Commerce Website</p>
        <div className="nav-actions">
          {!user ? (
            <ul>
              <li>
                <Link to="/sign-in">Sign In</Link>
              </li>
              <li>
                <Link to="/sign-up">Sign Up</Link>
              </li>
            </ul>
          ) : (
            <>
              <IconButton onClick={()=>toggleDrawer(open)} >
                <Avatar sx={{ width: 60, height: 60 }} src={user?.img}>{user.username[0].toUpperCase()}</Avatar>
              </IconButton>
              <Drawer open={open} onClose={()=>toggleDrawer(open)} anchor="right" sx={{position:"relative"}}>
                <UserProfile open={open} toggleDrawer={toggleDrawer} />
              </Drawer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
