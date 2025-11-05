import { useState, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users/Users";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Dashboard from "./components/Dashboard";
import { userContext } from "./context/userContext";
import { Navigate } from "react-router-dom";
import Unauthorized from "./components/Unauthorized";
import Products from "./components/Products/Products";
import Category from "./components/Categories/Category";
import AddCategory from "./components/Categories/AddCategory";
import EditCategory from "./components/Categories/EditCategory";

import EditUserPage from "./pages/users/EditUserPage";
function App() {
  const { user, setUser } = useContext(userContext);

  return (
    <Router>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Navbar />
        {user && (
          <Box
            sx={{
              height: "calc(100%-70px)",
              position: "fixed",
              backgroundColor: "rgba(20, 62, 249, 0.6)",
              width: "fit-content",
              overflowY: "auto",
              overflowX: "hidden",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { width: 0, height: 0 },
              "&::-webkit-scrollbar-thumb": { background: "transparent" },
              zIndex: 1,
              top: "70px",
              height: "100%",
            }}
          >
            <Sidebar />
          </Box>
        )}

        <Box
          sx={{
            position: "relative",
            top: "70px",
            left: user ? "90px" : "0px",
            width: user ? "calc(100% - 90px)" : "100%",
            height: "calc(100% - 70px)",
            overflow: "auto",
          }}
        >
          <Routes>
            <Route path="/sign-up" element={<Signup />} />
            <Route
              path="/sign-in"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Signin />
                )
              }
            />
            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/users/edit/:id" element={<EditUserPage />} />
            </Route>

            <Route
              element={<RoleProtectedRoute allowedRoles={["admin", "user"]} />}
            >
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route
              element={<RoleProtectedRoute allowedRoles={["admin", "user"]} />}
            >
              <Route path="/products" element={<Products />} />
            </Route>
            <Route
              element={<RoleProtectedRoute allowedRoles={["admin", "user"]} />}
            >
              <Route path="/categories" element={<Category />} />
              <Route path="/categories/add" element={<AddCategory />} />
              <Route path="/categories/edit/:id" element={<EditCategory />} />

            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>

          <ToastContainer />
        </Box>
      </Box>
    </Router>
  );
}

export default App;
