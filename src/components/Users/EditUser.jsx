import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
const EditUser = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Edit Product</Typography>

      <TextField
        label="Name"
        name="username"
        value={form.username}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="mobile"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={() => {
          onSave(user.id, form);
        }}
      >
        Save
      </Button>
      <Button variant="outlined" color="error" onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
};

export default EditUser;
