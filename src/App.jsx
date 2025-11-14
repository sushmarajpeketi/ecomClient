// src/App.jsx
import { useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Users from "./pages/users/Users";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Dashboard from "./components/Dashboard";
import { userContext } from "./context/userContext";
import Unauthorized from "./components/Unauthorized";
import Products from "./pages/products/Products";
import Category from "./pages/categories/Category";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";
import AddProductPage from "./pages/products/AddProductPage";
import EditProductPage from "./pages/products/EditProductPage";
import EditUserPage from "./pages/users/EditUserPage";
import Roles from "./pages/roles/Roles";
import AddRoles from "./pages/roles/AddRoles";
import EditRoles from "./pages/roles/EditRoles";
import ViewRoles from "./pages/roles/ViewRoles";
import AddUserPage from "./pages/users/AddUserPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme";
import { useNavigate } from "react-router-dom";
import Modules from "./pages/modules/Modules";
import AddModules from "./pages/modules/AddModules";
import EditModules from "./pages/modules/EditModules";

function App() {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
        <Navbar />
        {user && (
          <Box
            sx={{
              position: "fixed",
              backgroundColor: "#212121",
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
              element={user ? <Navigate to="/dashboard" replace /> : <Signin />}
            />
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("dashboard") &&
                      user?.permissions["dashboard"]?.includes("read"),
                  ]}
                />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("users") &&
                      user?.permissions["users"]?.includes("read"),
                  ]}
                />
              }
            >
              <Route path="/users" element={<Users />} />
            </Route>
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("products") &&
                      user?.permissions["products"]?.includes("read"),
                  ]}
                />
              }
            >
              <Route path="/products" element={<Products />} />
            </Route>
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("categories") &&
                      user?.permissions["categories"]?.includes("read"),
                  ]}
                />
              }
            >
              <Route path="/categories" element={<Category />} />
            </Route>
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("roles") &&
                      user?.permissions["roles"]?.includes("read"),
                  ]}
                />
              }
            >
              <Route path="/roles" element={<Roles />} />
              <Route path="/roles/view/:id" element={<ViewRoles />} />
            </Route>
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("modules") &&
                      user?.permissions["modules"]?.includes("read") &&
                      user.role === "superadmin",
                  ]}
                />
              }
            >
              <Route path="/modules" element={<Modules />} />
            </Route>

            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("users") &&
                      user?.permissions["users"]?.includes("write"),
                  ]}
                />
              }
            >
              <Route path="/users/add" element={<AddUserPage />} />
              <Route path="/users/edit/:id" element={<EditUserPage />} />
            </Route>
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("products") &&
                      user?.permissions["products"]?.includes("write"),
                  ]}
                />
              }
            >
              <Route path="/products/add" element={<AddProductPage />} />
              <Route path="/products/edit/:id" element={<EditProductPage />} />
            </Route>

            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("categories") &&
                      user?.permissions["categories"]?.includes("write"),
                  ]}
                />
              }
            >
              <Route path="/categories/add" element={<AddCategory />} />
              <Route path="/categories/edit/:id" element={<EditCategory />} />
            </Route>
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("roles") &&
                      user?.permissions["roles"]?.includes("write"),
                  ]}
                />
              }
            >
              <Route path="/roles/add" element={<AddRoles />} />

              <Route path="/roles/edit/:id" element={<EditRoles />} />
            </Route>
            <Route
              element={
                <RoleProtectedRoute
                  allowedPermissions={[
                    user?.permissions?.hasOwnProperty("modules") &&
                      user?.permissions["modules"]?.includes("write"),
                  ]}
                />
              }
            >
              <Route path="/modules/add" element={<AddModules />} />

              <Route path="/modules/edit/:id" element={<EditModules />} />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>

          <ToastContainer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
