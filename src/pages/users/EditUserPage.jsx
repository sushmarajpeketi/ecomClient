import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
  });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`);
        const data = res.data.data.user;

        setForm({
          username: data.username,
          email: data.email,
          mobile: data.mobile,
        });
      } catch (err) {
        toast.error("Failed to load user");
      }
    };

    fetchUser();
  }, [id]);

  // ✅ Handle save
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3000/users/${id}`, form);
      toast.success("User updated!");
      navigate("/users"); // redirect back
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "50px auto", padding: 4, boxShadow: 3 }}>
      <h2>Edit User</h2>

      <TextField
        fullWidth
        label="Username"
        value={form.username}
        sx={{ my: 2 }}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <TextField
        fullWidth
        label="Email"
        value={form.email}
        sx={{ my: 2 }}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <TextField
        fullWidth
        label="Mobile"
        value={form.mobile}
        sx={{ my: 2 }}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
      />

      <Button variant="contained" onClick={handleSave}>Save</Button>
      <Button variant="text" sx={{ ml: 2 }} onClick={() => navigate("/users")}>
        Cancel
      </Button>
    </Box>
  );
};

export default EditUserPage;
