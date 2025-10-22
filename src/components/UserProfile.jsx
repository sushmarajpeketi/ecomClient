import React from "react";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, IconButton, ButtonBase, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
const UserProfile = ({ toggleDrawer }) => {
  const { user, setUser } = useContext(userContext);
  const [avatarSrc, setAvatarSrc] = useState(null);
  let navigate = useNavigate();
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
  const logoutButtonHandler = () => {
    setUser({ username: "", email: "" });
    setAvatarSrc(null);
    navigate("/");
  };
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        component="div"
        sx={{
          height: "70px",
          bgcolor: "lightgray",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "cursive", marginLeft: "20px" }}>
          User Profile
        </span>
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
          sx={{
            width: 100,
            height: 100,
            position: "relative",
            cursor: "pointer",
          }}
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
        <EditIcon
          style={{
            position: "absolute",
            zIndex: 1,
            bottom: 0,
            right: 7,
            backgroundColor: "gray",
            color: "white",
            borderRadius: "50%",
          }}
        />

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
          variant="body1"
          fontWeight="light"
          fontFamily="cursive"
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
          variant="body"
          fontWeight="light"
          fontFamily="cursive"
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
        <Typography
          sx={{ display: "inline", gridArea: "myArea3", color: "blueviolet" }}
          variant="body"
          fontWeight="light"
          fontFamily="cursive"
        >
          Mobile:
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
          {user?.mobile}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          fontFamily: "cursive",
          bottom: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          mb: 2,
        }}
      >
        <Button
          sx={{
            color: "blueviolet",
            fontFamily: "cursive",
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
            fontFamily: "cursive",
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
};

export default UserProfile;
