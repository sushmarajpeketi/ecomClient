// src/components/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif", // Default for everything
    h1: { fontFamily: "Poppins, sans-serif", fontWeight: 600 },
    h2: { fontFamily: "Poppins, sans-serif", fontWeight: 600 },
    h3: { fontFamily: "Poppins, sans-serif", fontWeight: 600 },
    h4: { fontFamily: "Poppins, sans-serif", fontWeight: 600 },
    h5: { fontFamily: "Poppins, sans-serif", fontWeight: 600 },
    h6: { fontFamily: "Poppins, sans-serif", fontWeight: 600 },
    button: { fontWeight: 500 },
  },

  palette: {
    primary: {
      main: "#424242", 
      dark: "#212121", 
      contrastText: "#fff",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
          height: 40,
        },
        contained: {
          backgroundColor: "#424242",
          color: "#fff",
          "&:hover": { backgroundColor: "#212121" },
          "&.Mui-disabled": { backgroundColor: "#bdbdbd", color: "#fff" },
        },
        outlined: {
          borderColor: "#424242",
          color: "#424242",
          "&:hover": { borderColor: "#212121", color: "#212121" },
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        inputSizeSmall: {
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: "0.92rem",
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": { color: "#424242" },
          "&.Mui-checked + .MuiSwitch-track": { backgroundColor: "#424242" },
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontWeight: 700,
            color: "#fff",
            backgroundColor: "#1f2937",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
    },
  },
});

export default theme;
