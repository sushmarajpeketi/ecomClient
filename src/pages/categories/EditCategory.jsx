// src/pages/categories/EditCategory.jsx
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const BASE_URL = "http://localhost:3000";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: "",
    status: true,
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const loadCategory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/category/${id}`, {
        withCredentials: true,
      });
      const data = res?.data?.data || res?.data;
      setCategory({
        name: data?.name || "",
        description: data?.description || "",
        status: typeof data?.status === "boolean" ? data.status : true,
      });
      openToast("Category loaded", "success");
    } catch {
      openToast("Failed to load category", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadCategory();
  }, [id]);

  const handleChange = (e) => {
    setCategory((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleToggle = (e) => {
    setCategory((s) => ({ ...s, status: e.target.checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/category/${id}`, category, {
        withCredentials: true,
      });
      openToast("Category updated successfully", "success");
      setTimeout(() => navigate("/categories"), 600);
    } catch {
      openToast("Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const crumbs = [{ label: "Categories", to: "/categories" }, { label: "Edit Category" }];

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
        <PageHeader title="Edit Category" crumbs={crumbs} fontSize="1rem" />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Card sx={{ width: "60%", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Category Details
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  opacity: loading ? 0.6 : 1,
                  pointerEvents: loading ? "none" : "auto",
                }}
              >
                <TextField
                  label="Category Name"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={!!category.status}
                      onChange={handleToggle}
                      size="small"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "grey.800" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "grey.800",
                        },
                      }}
                    />
                  }
                  label={category.status ? "Active" : "Inactive"}
                />
                <Box />
              </Box>

              <Divider />
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
            mt: 2,
          }}
        >
          <Button variant="outlined" onClick={() => navigate("/categories")} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleSave}
            sx={{
              bgcolor: !loading ? "grey.800" : "grey.400",
              color: "common.white",
              "&:hover": { bgcolor: !loading ? "grey.900" : "grey.400" },
            }}
          >
            {loading ? "Saving..." : "Save"}
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
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditCategory;
