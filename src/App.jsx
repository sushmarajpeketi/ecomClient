import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";

import Users from "./components/Users";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Dashboard from "./components/Dashboard";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  console.log("from app", isSignedIn);

  return (
    <Router>
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Navbar userPresent={isSignedIn} setUserPresence={setIsSignedIn} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            position: "relative",
            top: "70px",
            height: "calc(100% - 70px)",
            width: "100%",
          }}
        >
          <Box
            sx={{
              height: "calc(100%-70px)",
              position: "relative",
              backgroundColor: "rgba(189, 152, 224, 1)",
              width: "fit-content",
              overflowY: "auto",
              overflowX: "hidden",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { width: 0, height: 0 },
              "&::-webkit-scrollbar-thumb": { background: "transparent" },
              zIndex: 1,
            }}
          >
            <Sidebar />
          </Box>
          <Box
            sx={{
              height: "100%",
              position: "relative",
              left: "90x",
              width: "100%",
            }}
          >
            <Routes>
              <Route
                path="/sign-up"
                element={
                  <Signup
                    userPresent={isSignedIn}
                    setUserPresence={setIsSignedIn}
                  />
                }
              />
              <Route
                path="/sign-in"
                element={
                  <Signin
                    userPresent={isSignedIn}
                    setUserPresence={setIsSignedIn}
                  />
                }
              />
              <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/users" element={<Users />} />
              </Route>

              <Route
                element={
                  <RoleProtectedRoute allowedRoles={["admin", "user"]} />
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </Box>
        </Box>
      </Box>

      <ToastContainer />
    </Router>
  );
}

export default App;
