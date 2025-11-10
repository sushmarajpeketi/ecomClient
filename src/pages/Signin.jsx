import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";

import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
} from "@mui/material";

import { userContext } from "../context/userContext";

const Signin = () => {
  const { setUser: setGlobalUser } = useContext(userContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [isError, setIsError] = useState({ email: false, password: false });

  const emailSchema = z.string().email("Invalid email address");
  const passwordSchema = z.string().min(4, "Password must be at least 4 characters");

  const navigate = useNavigate();

  const focusHandler = (name) => {
    if (name === "password" && !user.email) {
      setError((prev) => ({ ...prev, email: "Required field" }));
      setIsError((prev) => ({ ...prev, email: true }));
    }
    if (name === "password" && !user.password) {
      setError((prev) => ({ ...prev, password: "Required field" }));
      setIsError((prev) => ({ ...prev, password: true }));
    }
  };

  const changeHandler = (name, val, schema) => {
    const v = val.trim();
    setUser((s) => ({ ...s, [name]: v }));
    const validation = schema.safeParse(v);
    if (!validation.success) {
      setError((e) => ({ ...e, [name]: validation.error.issues[0].message }));
      setIsError((ie) => ({ ...ie, [name]: true }));
    } else {
      setError((e) => ({ ...e, [name]: "" }));
      setIsError((ie) => ({ ...ie, [name]: false }));
    }
  };

  const submitHandler = async (e) => {
    e?.preventDefault?.();
    if (!user.email) {
      setError((prev) => ({ ...prev, email: "Required field" }));
      setIsError((prev) => ({ ...prev, email: true }));
      return;
    } else if (!user.password) {
      setError((prev) => ({ ...prev, password: "Required field" }));
      setIsError((prev) => ({ ...prev, password: true }));
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/users/sign-in", user, {
        withCredentials: true,
      });
      toast.success(res.data.message);

      setUser({ email: "", password: "" });
      setError({ email: "", password: "" });

      const userDetails = await axios.get("http://localhost:3000/users/user-info", {
        withCredentials: true,
      });

      setGlobalUser({
        username: userDetails.data.username,
        email: userDetails.data.email,
        id: userDetails.data.id,
        role: userDetails.data.role,
        mobile: userDetails.data.mobile,
        img: userDetails.data.img,
      });

      navigate("/");
    } catch (e) {
      const backendMsg = e.response?.data?.error;
      if (Array.isArray(backendMsg)) backendMsg.forEach((err) => toast.error(err.message));
      else toast.error(backendMsg || e.message);
    }
  };

  const disabled = Object.values(isError).some(Boolean);

  return (
    <Container maxWidth="xs" sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <Paper component="form" onSubmit={submitHandler} sx={{ p: 3, width: "100%" }}>
        <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
          Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Welcome back. Enter your credentials.
        </Typography>

        <Stack spacing={2}>
          <TextField
            name="email"
            label="Email"
            type="email"
            value={user.email}
            onChange={(e) => changeHandler("email", e.target.value, emailSchema)}
            error={isError.email}
            helperText={error.email}
            onFocus={(e) => focusHandler(e.target.name)}
            fullWidth
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={user.password}
            onChange={(e) => changeHandler("password", e.target.value, passwordSchema)}
            error={isError.password}
            helperText={error.password}
            onFocus={(e) => focusHandler(e.target.name)}
            fullWidth
          />

          <Button type="submit" disabled={disabled}>
            Sign In
          </Button>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/sign-up")}
            >
              Create account
            </Button>
            <Button variant="text" color="secondary" onClick={() => navigate("/")}>
              Back to home
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Signin;
