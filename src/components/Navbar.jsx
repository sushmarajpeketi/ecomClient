import "./navbar.css";
import { useContext, useState } from "react";
import { userContext } from "../context/userContext";

import { Link, useNavigate } from "react-router-dom";
import { Avatar, IconButton, ButtonBase, Typography } from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const { user, setUser } = useContext(userContext);
  const [avatarSrc, setAvatarSrc] = useState(null);

  let navigate = useNavigate();
  const logoutButtonHandler = () => {
    setUser({ username: "", email: "" });
    setAvatarSrc(null);
    navigate("/");
  };
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        component="div"
        sx={{
          height: "50px",
          bgcolor: "lightgray",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>User Profile</span>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <ButtonBase
        component="label"
        role={undefined}
        tabIndex={-1}
        aria-label="Avatar image"
        sx={{
          width: 100,
          height: 100,
          borderRadius: "40px",
          "&:has(:focus-visible)": {
            outline: "2px solid",
            outlineOffset: "2px",
          },
          marginTop: "40px",
          marginLeft: "80px",
        }}
      >
        <Avatar
          sx={{ width: 100, height: 100 }}
          alt="Upload new avatar"
          src={
            typeof avatarSrc === "string" && avatarSrc.startsWith("data:")
              ? avatarSrc
              : undefined
          }
        >
          {(!avatarSrc || !avatarSrc.startsWith("data:")) &&
            user?.username[0]?.toUpperCase()}
        </Avatar>

        <input
          type="file"
          accept="image/*"
          style={{
            border: 0,
            clip: "rect(0 0 0 0)",
            height: "1px",
            margin: "-1px",
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            whiteSpace: "nowrap",
            width: "1px",
          }}
          onChange={handleAvatarChange}
        />
      </ButtonBase>

      <Box
        sx={{
          textAlign: "center",
          mb: 2,
          display: "grid",
          gridTemplateAreas: "'myArea1 myArea2 ''myArea3 myArea4'",
          columnGap: 1,
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <Typography
          sx={{ display: "inline", gridArea: "myArea1", color: "blueviolet" }}
          variant="body2"
          fontWeight="light"
        >
          Name:
        </Typography>

        <Typography
          sx={{
            display: "inline",
            gridArea: "myArea2",
            justifySelf: "start",
            color: "gray",
          }}
          variant="body2"
          color="text.secondary"
        >
          {user?.username}
        </Typography>
        <Typography
          sx={{ display: "inline", gridArea: "myArea3", color: "blueviolet" }}
          variant="body2"
          fontWeight="light"
        >
          Email:
        </Typography>
        <Typography
          sx={{
            display: "inline",
            gridArea: "myArea4",
            justifySelf: "start",
            color: "gray",
          }}
          variant="body2"
          color="text.secondary"
        >
          {user?.email}
        </Typography>
      </Box>

      <Box>
        <Button
          sx={{
            color: "blueviolet",

            "&:hover": {
              borderColor: "blueviolet",
              backgroundColor: "rgba(138, 43, 226, 0.1)",
            },
          }}
          variant="text"
        >
          Change Password
        </Button>
        <Button
          sx={{
            color: "blueviolet",

            "&:hover": {
              borderColor: "blueviolet",
              backgroundColor: "rgba(138, 43, 226, 0.1)",
            },
          }}
          onClick={logoutButtonHandler}
          variant="text"
        >
          Logout &nbsp; <LogoutRoundedIcon />
        </Button>
      </Box>
    </Box>
  );

  return (
    <div className="nav-container">
      <div className="nav">
        <p>E-Commerce Website</p>
        <div className="nav-actions">
          {!user.username ? (
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
              <IconButton onClick={toggleDrawer(true)}>
                <Avatar>{user.username[0].toUpperCase()}</Avatar>
              </IconButton>
              <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
                {DrawerList}
              </Drawer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
