import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import DraftsIcon from "@mui/icons-material/Drafts";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { userContext } from "../context/userContext";
const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = React.useState();
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      sx={{
        width: "90px",
        minWidth: 60,
        margin: "0",
        marginTop: "1000",
      }}
    >
      <List
        component="nav"
        aria-label="main mailbox folders"
        sx={{
          padding: 0,
          margin: 0,
          "& .MuiListItemButton-root": {
            display: "flex",
            flexDirection: "column",
          },
          "& .MuiListItemIcon-root": {
            minWidth: "unset",
            padding: 0,
          },
          "& .MuiListItemText-root": {
            textAlign: "center",
            fontSize: "30px",
            color: "white",
            fontWeight: 300,
          },
          "& .MuiTypography-root": {
            fontFamily: "cursive",
            fontSize: "50%",
            fontWeight: 100,
            color: "white",
            textAlign: "center",
          },
          "& .MuiListItemButton-root.Mui-selected": {
            backgroundColor: "rgba(97, 84, 139, 0.5)",
            color: "white",
          },
        }}
      >
        {user?.role === "admin" && (
          <>
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={(event) => {
                handleListItemClick(event, 0);
                navigate("/users");
              }}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <ListItemIcon>
                <GroupOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
            <Divider />
          </>
        )}

        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => {
            handleListItemClick(event, 1);
            navigate("/dashboard");
          }}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <Divider />


        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => {
            handleListItemClick(event, 2);
            navigate("/products");
          }}
        >
          <ListItemIcon>
            <LocalGroceryStoreIcon/>
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItemButton>
        <Divider />
      </List>
      <Divider />
    </Box>
  );
};

export default Sidebar;
