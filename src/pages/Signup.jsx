import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Signup = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "", mobile: "" });
  const [error, setError] = useState({ username: "", email: "", password: "", mobile: "" });
  const [isError, setIsError] = useState({ username: false, email: false, password: false, mobile: false });

  const navigate = useNavigate();

  const nameSchema = z.string().min(3, "Name must be at least 3 characters").regex(/^[a-z A-Z"]+$/, "Name should only consist of alphabets.");
  const emailSchema = z.string().email("Invalid email address");
  const passwordSchema = z.string().min(4, "Password must be at least 4 characters");
  const mobileSchema = z.coerce.number().int().max(9999999999, "Mobile shouldn't be greater than 10 digits").min(1000000000, "Mobile shouldn't be less than 10 digits");

  const focusHandler = (name) => {
    if (name === "email" && !user.username) {
      setError((prev) => ({ ...prev, username: "Required field" }));
      setIsError((prev) => ({ ...prev, username: true }));
    }
    if (name === "password") {
      if (!user.username) {
        setError((prev) => ({ ...prev, username: "Required field" }));
        setIsError((prev) => ({ ...prev, username: true }));
      }
      if (!user.email) {
        setError((prev) => ({ ...prev, email: "Required field" }));
        setIsError((prev) => ({ ...prev, email: true }));
      }
      if (!user.password) {
        setError((prev) => ({ ...prev, password: "Required field" }));
        setIsError((prev) => ({ ...prev, password: true }));
      }
    }
  };

  const changeHandler = (name, val, schema) => {
    const v = `${val}`.trim();
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
    e.preventDefault();

    if (!user.username) {
      setError((prev) => ({ ...prev, username: "Required field" }));
      setIsError((prev) => ({ ...prev, username: true }));
      return;
    } else if (!user.email) {
      setError((prev) => ({ ...prev, email: "Required field" }));
      setIsError((prev) => ({ ...prev, email: true }));
      return;
    } else if (!user.password) {
      setError((prev) => ({ ...prev, password: "Required field" }));
      setIsError((prev) => ({ ...prev, password: true }));
      return;
    } else if (!user.mobile) {
      setError((prev) => ({ ...prev, mobile: "Required field" }));
      setIsError((prev) => ({ ...prev, mobile: true }));
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/users/sign-up", user);
      toast.success(res?.data?.message);
      setError({ username: "", email: "", password: "", mobile: "" });
      setUser({ username: "", email: "", password: "", mobile: "" });
      navigate("/sign-in");
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
          Sign Up
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create your account.
        </Typography>

        <Stack spacing={2}>
          <TextField
            required
            name="username"
            label="Name"
            type="text"
            value={user.username}
            onChange={(e) => changeHandler("username", e.target.value, nameSchema)}
            error={isError.username}
            helperText={error.username}
            onFocus={(e) => focusHandler(e.target.name)}
            fullWidth
          />
          <TextField
            required
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
            required
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
          <TextField
            required
            name="mobile"
            label="Mobile Number"
            type="number"
            value={user.mobile}
            onChange={(e) => changeHandler("mobile", e.target.value, mobileSchema)}
            error={isError.mobile}
            helperText={error.mobile}
            onFocus={(e) => focusHandler(e.target.name)}
            fullWidth
          />

          <Button type="submit" disabled={disabled}>
            Sign Up
          </Button>

          <Divider />

          
        </Stack>
      </Paper>
    </Container>
  );
};

export default Signup;
