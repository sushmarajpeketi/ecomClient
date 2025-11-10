// src/pages/users/AddUserPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const BASE_URL = "http://localhost:3000";
const GET_ROLES_URL = `${BASE_URL}/roles?rows=100`;
const CREATE_USER_URL = `${BASE_URL}/users/employee/create`;

const validators = {
  username: (v) =>
    !v ? "Username is required" : v.trim().length < 3 ? "At least 3 characters" : "",
  email: (v) =>
    !v
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? "Enter a valid email"
      : "",
  password: (v) => (!v ? "Password is required" : v.length < 4 ? "At least 4 characters" : ""),
  mobile: (v) =>
    !v ? "Mobile is required" : !/^\d{10}$/.test(String(v).trim()) ? "Enter 10 digits" : "",
  role: (v) => (!v ? "Role is required" : ""),
};

const AddUserPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
    role: "",
  });

  const [roles, setRoles] = useState([]);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(GET_ROLES_URL, { withCredentials: true });
        const list = res?.data?.data ?? res?.data ?? [];
        setRoles(Array.isArray(list) ? list : []);
      } catch (err) {
        openToast(
          err?.response?.data?.message || err?.response?.data?.error || "Failed to load roles",
          "error"
        );
      }
    })();
  }, []);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const markTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));

  const fieldError = (name) => {
    const fn = validators[name];
    return fn ? fn(form[name]) : "";
  };

  const errors = useMemo(
    () =>
      Object.keys(validators).reduce((acc, k) => {
        acc[k] = validators[k](form[k]);
        return acc;
      }, {}),
    [form]
  );

  const isValid = useMemo(() => Object.values(errors).every((e) => !e), [errors]);

  const handleSubmit = async () => {
    setTouched(
      Object.keys(form).reduce((acc, k) => {
        acc[k] = true;
        return acc;
      }, {})
    );

    if (!isValid) {
      openToast("Please fix the highlighted errors.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        mobile: String(form.mobile).trim(),
        role: form.role,
      };

      await axios.post(CREATE_USER_URL, payload, {
        withCredentials: true,
      });

      openToast("User added successfully!", "success");
      setTimeout(() => navigate("/users"), 500);
    } catch (err) {
      openToast(
        err?.response?.data?.message || err?.response?.data?.error || "Failed to add user",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const crumbs = [{ label: "Users", to: "/users" }, { label: "Add User" }];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontSize: "0.85rem",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 2,
          py: 0.75,
        }}
      >
        <PageHeader title="Add User" crumbs={crumbs} fontSize="1rem" />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Card sx={{ width: "90%", p: 2 ,marginTop:"30px"}}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                User Details
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 3,
                }}
              >
                <Box>
                  {touched.username && fieldError("username") ? (
                    <Typography variant="caption" color="error">
                      {fieldError("username")}
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ visibility: "hidden" }}>
                      placeholder
                    </Typography>
                  )}
                  <TextField
                    label="Name"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    onBlur={() => markTouched("username")}
                    error={Boolean(touched.username && fieldError("username"))}
                    fullWidth
                    size="large"
                  />
                </Box>

                <Box>
                  {touched.email && fieldError("email") ? (
                    <Typography variant="caption" color="error">
                      {fieldError("email")}
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ visibility: "hidden" }}>
                      placeholder
                    </Typography>
                  )}
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => markTouched("email")}
                    error={Boolean(touched.email && fieldError("email"))}
                    fullWidth
                    size="large"
                  />
                </Box>

                <Box>
                  {touched.password && fieldError("password") ? (
                    <Typography variant="caption" color="error">
                      {fieldError("password")}
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ visibility: "hidden" }}>
                      placeholder
                    </Typography>
                  )}
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={() => markTouched("password")}
                    error={Boolean(touched.password && fieldError("password"))}
                    fullWidth
                    size="large"
                  />
                </Box>

                <Box>
                  {touched.mobile && fieldError("mobile") ? (
                    <Typography variant="caption" color="error">
                      {fieldError("mobile")}
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ visibility: "hidden" }}>
                      placeholder
                    </Typography>
                  )}
                  <TextField
                    label="Mobile"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    onBlur={() => markTouched("mobile")}
                    error={Boolean(touched.mobile && fieldError("mobile"))}
                    fullWidth
                    size="large"
                  />
                </Box>

                <Box>
                  {touched.role && fieldError("role") ? (
                    <Typography variant="caption" color="error">
                      {fieldError("role")}
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ visibility: "hidden" }}>
                      placeholder
                    </Typography>
                  )}
                  <FormControl
                    fullWidth
                    error={Boolean(touched.role && fieldError("role"))}
                    size="large"
                  >
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      label="Role"
                      value={form.role}
                      onChange={handleChange}
                      onBlur={() => markTouched("role")}
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 240 } },
                      }}
                    >
                      {roles.map((r) => (
                        <MenuItem key={r.id || r._id} value={r.id || r._id}>
                          {r.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box />
              </Box>

             
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            width: "90%",
            mx: "auto",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 5,
          }}
        >
          <Button variant="outlined" onClick={() => navigate("/users")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!isValid || submitting}
            onClick={handleSubmit}
            sx={{width:"90px"}}
          >
            {submitting ? "Adding..." : "Add"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          py: 1,
          fontSize: "0.7rem",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        © {new Date().getFullYear()} ecom
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddUserPage;
