import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DraftsIcon from "@mui/icons-material/Drafts";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import { userContext } from "../context/userContext";

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const navItems = [
    { label: "Dashboard", icon: <DraftsIcon />, path: "/dashboard" },
    ...(user?.role === "admin"
      ? [{ label: "Users", icon: <GroupOutlinedIcon />, path: "/users" }]
      : []),
    { label: "Products", icon: <LocalGroceryStoreIcon />, path: "/products" },
    { label: "Categories", icon: <LocalGroceryStoreIcon />, path: "/categories" },
    { label: "Roles", icon: <LocalGroceryStoreIcon />, path: "/roles" },
  ];

  return (
    <Box
      sx={{
        width: "90px",
        minWidth: 60,
        height: "100vh",
        bgcolor: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,

        // ✅ REMOVE ALL SIDEBAR BORDERS
        borderRight: "none !important",
        boxShadow: "none !important",
      }}
    >
      <List
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,

          "& .MuiListItemButton-root": {
            display: "flex",
            flexDirection: "column",
            py: 1.5,
            borderRadius: 2,
            position: "relative",
            color: "#ddd",
          },

          // ✅ Selected item styling (clean + visible)
          "& .Mui-selected": {
            bgcolor: "rgba(255,255,255,0.08)",
            color: "#fff",
          },

          // left bar indicator on selected
          "& .Mui-selected::before": {
            content: '""',
            position: "absolute",
            left: 0,
            height: "60%",
            width: "4px",
            borderRadius: "0 4px 4px 0",
            backgroundColor: "#fff",
          },

          "& .MuiListItemIcon-root": {
            minWidth: "unset",
          },

          "& svg": {
            fontSize: "22px",
          },

          "& .MuiTypography-root": {
            fontSize: "11px",
            marginTop: "4px",
          },
        }}
      >
        {navItems.map((item, index) => (
          <ListItemButton
            key={item.label}
            selected={selectedIndex === index}
            onClick={() => {
              setSelectedIndex(index);
              navigate(item.path);
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
