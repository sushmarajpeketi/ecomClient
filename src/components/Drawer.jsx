import React from "react";
import { Drawer } from "@mui/material";


const Drawer = ({children,anchorDirection,}) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (val) => {
    console.log("toggle drawer is ", val);
    setOpen(!val);
  };
  return (
    <Drawer
      open={open}
      onClose={() => toggleDrawer(open)}
      anchor={anchorDirection}
      sx={{ position: "relative" }}
    >
        {children}
    </Drawer>
  );
};

export default Drawer;
