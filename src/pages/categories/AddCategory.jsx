// src/pages/categories/AddCategory.jsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";

export default function AddCategory() {
  const navigate = useNavigate();

  const [cat, setCat] = useState({
    name: "",
    description: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const changeHandler = (e) => {
    setCat((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const toggleStatus = (e) => {
    setCat((s) => ({ ...s, status: e.target.checked }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!cat.name.trim()) {
      openToast("Category name is required", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/category/create-category",
        cat,
        { withCredentials: true }
      );
      openToast(res?.data?.message || "Category added successfully!", "success");
      setTimeout(() => navigate("/categories"), 600);
    } catch (err) {
      openToast(
        err?.response?.data?.error || err.message || "Failed to add category",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const crumbs = [{ label: "Categories", to: "/categories" }, { label: "Add Category" }];

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
        <PageHeader title="Add Category" crumbs={crumbs} fontSize="1rem" />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2,mt:10 }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Card sx={{ width: "90%", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Category Details
              </Typography>

              <Box
                component="form"
                onSubmit={submitHandler}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                <TextField
                  name="name"
                  label="Category Name"
                  required
                  value={cat.name}
                  onChange={changeHandler}
                  fullWidth
                  size="large"
                />

                <TextField
                  name="description"
                  label="Description"
                  value={cat.description}
                  onChange={changeHandler}
                  fullWidth
                  size="large"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={!!cat.status}
                      onChange={toggleStatus}
                      size="large"
                    />
                  }
                  label={cat.status ? "Active" : "Inactive"}
                  sx={{ gridColumn: "1 / span 1" }}
                />

                <Box />

                <button type="submit" style={{ display: "none" }} />
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
            mt: 4,
          }}
        >
          <Button variant="outlined" onClick={() => navigate("/categories")} disabled={loading}>
            Cancel
          </Button>
          <Button variant="contained" disabled={loading} onClick={submitHandler}>
            {loading ? "Adding..." : "Add Category"}
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
}
