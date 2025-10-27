import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./sign.css";
import { toast } from "react-toastify";
import { z } from "zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { userContext } from "../context/userContext";

const Signin = () => {
  const { user: globalUser, setUser: setGlobalUser } = useContext(userContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [isError, setIsError] = useState({ email: false, password: false });

  let emailSchema = z.string().email("Invalid email address");
  let passwordSchema = z
    .string()
    .min(4, "Password must be at least 4 characters");

  let navigate = useNavigate();

  const focusHandler = (name) => {
    if (name === "password" && !user.email) {
      setError((prev) => ({ ...prev, email: "Required field" }));
      setIsError((prev) => ({ ...prev, email: true }));
    }

    if (name === "password" && !user.password) {
      console.log("entering");
      setError((prev) => ({ ...prev, password: "Required field" }));
      setIsError((prev) => ({ ...prev, password: true }));
      return;
    }
  };
  const changeHandler = (name, val, schema) => {
    val = val.trim();
    setUser({ ...user, [name]: val });
    console.log(user);
    let validation = schema.safeParse(val);
    if (!validation.success) {
      setError({ ...error, [name]: validation.error.issues[0].message });
      setIsError({ ...isError, [name]: true });
      return;
    } else {
      setIsError({ ...isError, [name]: false });
      setError({ ...error, [name]: "" });
    }
    return;
  };
  const submitHandler = async () => {
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
      const res = await axios.post(
        "http://localhost:3000/users/sign-in",
        user,
        { withCredentials: true }
      );
      console.log("signing in ", res.data.message);
      toast.success(res.data.message);
      setUser({ email: "", password: "" });
      setError({ email: "", password: "" });
      try {
        const userDetails = await axios.get(
          "http://localhost:3000/users/user-info",
          {
            withCredentials: true,
          }
        );
        console.log("USERDETAILS", userDetails.data);
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
        toast.error(e.response?.data?.error || e.message || e.error);
      }
    } catch (e) {
      const backendMsg = e.response?.data?.error;

      if (Array.isArray(backendMsg)) {
        backendMsg.forEach((err) => toast.error(err.message));
      } else {
        toast.error(backendMsg || e.message);
      }
    }
  };

  return (
    <div className="form">
      <div className="head">Sign In</div>
      <div className="form-actions">
        <TextField
          required
          id="outlined-password-input"
          name="email"
          label="email"
          type="email"
          value={user.email}
          autoComplete="current-password"
          onChange={(e) =>
            changeHandler(e.target.name, e.target.value, emailSchema)
          }
          error={isError.email}
          helperText={error.email}
          onFocus={(e) => focusHandler(e.target.name)}
        />
        <TextField
          required
          id="outlined-password-input"
          name="password"
          label="Password"
          type="password"
          value={user.password}
          autoComplete="current-password"
          onChange={(e) =>
            changeHandler(e.target.name, e.target.value, passwordSchema)
          }
          error={isError.password}
          helperText={error.password}
          onFocus={(e) => focusHandler(e.target.name)}
        />
        <Button
          onClick={submitHandler}
          className="button signin-button"
          variant="contained"
          disabled={Object.values(isError).filter((el) => el).length > 0}
        >
          SignIn
        </Button>
      </div>
    </div>
  );
};

export default Signin;
