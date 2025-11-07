
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PageHeader from "../../components/PageHeader";

export default function AddCategory() {
  const navigate = useNavigate();

  const [cat, setCat] = useState({
    name: "",
    description: "",
    status: true, 
  });
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setCat((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const toggleStatus = (e) => {
    setCat((s) => ({ ...s, status: e.target.checked }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!cat.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/categories/create-category",
        cat,
        { withCredentials: true }
      );
      toast.success(res?.data?.message || "Category added successfully!");
      navigate("/categories");
    } catch (err) {
      toast.error(err?.response?.data?.error || err.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <PageHeader
        title="Add Category"
        crumbs={[{ label: "Categories", to: "/categories" }, { label: "Add Category" }]}
      />

      
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card sx={{ width: "60%", p: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Category Details
            </Typography>

            <Box
              component="form"
              onSubmit={submitHandler}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
              }}
            >
          
              <TextField
                name="name"
                label="Category Name"
                required
                value={cat.name}
                onChange={changeHandler}
                fullWidth
              />

              <TextField
                name="description"
                label="Description"
                value={cat.description}
                onChange={changeHandler}
                fullWidth
              />

         
              <FormControlLabel
                control={<Switch checked={!!cat.status} onChange={toggleStatus} />}
                label={cat.status ? "Active" : "Inactive"}
              />
              <Box /> 

              <button type="submit" style={{ display: "none" }} />
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
        <Button variant="contained" disabled={loading} onClick={submitHandler}>
          {loading ? "Adding..." : "Add Category"}
        </Button>
      </Box>
    </Box>
  );
}
