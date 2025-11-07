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
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "../../components/PageHeader";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: "",
    status: true,
  });

  const loadCategory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/categories/${id}`, {
        withCredentials: true,
      });
      const data = res?.data?.data || res?.data;
      setCategory({
        name: data?.name || "",
        description: data?.description || "",
        status: typeof data?.status === "boolean" ? data.status : true,
      });
    } catch (err) {
      toast.error("Failed to load category");
      console.error(err);
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
      await axios.put(`http://localhost:3000/categories/${id}`, category, {
        withCredentials: true,
      });
      toast.success("Category updated successfully");
      navigate("/categories");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <PageHeader
        title="Edit Category"
        crumbs={[
          { label: "Categories", to: "/categories" },
          { label: "Edit Category" },
        ]}
      />

      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card sx={{ width: "60%", p: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Category Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
              }}
            >
              <TextField
                label="Category Name"
                name="name"
                value={category.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={category.description}
                onChange={handleChange}
                fullWidth
              />

              <FormControlLabel
                control={
                  <Switch checked={!!category.status} onChange={handleToggle} />
                }
                label={category.status ? "Active" : "Inactive"}
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
        <Button variant="outlined" onClick={() => navigate("/categories")}>
          Cancel
        </Button>
        <Button variant="contained" disabled={loading} onClick={handleSave}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditCategory;
