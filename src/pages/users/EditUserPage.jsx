// src/pages/users/EditUserPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PageHeader from "../../components/PageHeader";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`, {
          withCredentials: true,
        });
        const data = res?.data?.data?.user || res?.data?.data || res?.data;
        setForm({
          username: data?.username || "",
          email: data?.email || "",
          mobile: data?.mobile || "",
        });
      } catch (err) {
        toast.error("Failed to load user");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const invalid = useMemo(() => {
    const uOK = form.username.trim().length >= 3;
    const eOK = /.+@.+\..+/.test(form.email.trim());
    const mOK = /^[0-9]{10}$/.test(String(form.mobile).trim());
    return !(uOK && eOK && mOK);
  }, [form]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/users/${id}`, form, {
        withCredentials: true,
      });
      toast.success("User updated!");
      navigate("/users");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <PageHeader
        title="Edit User"
        crumbs={[{ label: "Users", to: "/users" }, { label: "Edit User" }]}
      />

 
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card sx={{ width: "60%", p: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              User Details
            </Typography>

 
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
              }}
            >
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />

              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />

              <TextField
                label="Mobile (10 digits)"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />

      
              <Box />
            </Box>
          </CardContent>
        </Card>
      </Box>

  
      <Box
        sx={{
          width: "60%",
          mx: "auto",
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 3,
        }}
      >
        <Button variant="outlined" onClick={() => navigate("/users")} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading || invalid}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditUserPage;
