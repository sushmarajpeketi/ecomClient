import React from "react";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, IconButton, ButtonBase, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { userContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import axios from "axios";
const UserProfile = ({ open, toggleDrawer }) => {
  const { user, setUser, fetchUser } = useContext(userContext);
  const [avatarSrc, setAvatarSrc] = useState(user.img);
  let navigate = useNavigate();

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const res = await axios.post(
          "http://localhost:3000/users/upload-avatar",
          formData,
          {
            withCredentials: true,
          }
        );
        
        toast.success(res.data.message);
        console.log("Uploaded successfully:", res.data);
       
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(error?.response?.data?.error || error.message);
      }
      return
    }
  };
  const logoutButtonHandler = async() => {
    try{
        let res = await axios("http://localhost:3000/users/logout",{withCredentials:true})
        setUser({username:"",email:"",role:"",id:"",mobile:"",img:""});
        toggleDrawer(open);
        navigate("/sign-in");
        console.log("hey")
        toast.success(res?.data?.message)
        return
    }catch(e){
       toast.error(e?.response?.data?.message||e?.data?.error||e?.message)
    }
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
        <IconButton onClick={() => {
          toggleDrawer(open)
          fetchUser()
          }}>
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
          src={typeof avatarSrc === "string" ? avatarSrc : undefined}
        >
          {!avatarSrc && user?.username[0]?.toUpperCase()}
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
          gridTemplateAreas:
            "'myArea1 myArea2 ' 'myArea3 myArea4' 'myArea5 myArea6'",
          columnGap: 1,
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <Typography
          sx={{ display: "inline", gridArea: "myArea1", color: "rgba(20, 62, 249, 1)" }}
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
          sx={{ display: "inline", gridArea: "myArea3", color: "rgba(20, 62, 249, 1)" }}
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
          sx={{ display: "inline", gridArea: "myArea5", color: "rgba(20, 62, 249, 1)" }}
          variant="body"
          fontWeight="light"
          fontFamily="cursive"
        >
          Mobile:
        </Typography>
        <Typography
          sx={{
            display: "inline",
            gridArea: "myArea6",
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
            color: "rgba(20, 62, 249, 1)",
            fontFamily: "cursive",
            "&:hover": {
              borderColor: "rgba(87, 159, 179, 0.1)",
              backgroundColor: "rgba(96, 173, 215, 0.5)",
            },
          }}
          variant="text"
        >
          Change Password
        </Button>
        <Button
          sx={{
            color: "rgba(20, 62, 249, 1)",
            fontFamily: "cursive",
            "&:hover": {
              borderColor: "rgba(87, 159, 179, 0.1)",
              backgroundColor: "rgba(96, 173, 215, 0.5)",
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
