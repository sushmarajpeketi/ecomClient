
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000", 
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#424242",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#616161",
    },
    divider: "#e0e0e0",
  },
  typography: {
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    h5: { fontWeight: 600, letterSpacing: 0.2 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 3 },
      styleOverrides: {
        root: ({ ownerState }) => ({
          border: ownerState?.square ? "none" : "1px solid #e6e6e6",
        }),
      },
    },
    MuiButton: {
      defaultProps: { variant: "contained", color: "primary" },
      styleOverrides: {
        contained: {
          boxShadow: "none",
        },
      },
    },
     MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: "1px solid #f0f0f0", 
      },
      head: {
        fontWeight: 600,
        backgroundColor: "#fafafa",
        borderBottom: "1px solid #e6e6e6 !important",
      },
    },
  },  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: "#fafafa", 
        },
      },
    },
  },
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined" },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontSize: "0.95rem" } },
    },
  },
});

export default theme;
