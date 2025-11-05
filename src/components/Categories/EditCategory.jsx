import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    description: "",
    status: true,
  });

  // ✅ Fetch existing category
  const fetchCategory = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/category/${id}`);
      setCategory(res.data.data);
    } catch (error) {
      toast.error("Failed to load category");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // ✅ Handle field change
  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  // ✅ Save category
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/categories/${id}`, category);

      toast.success("Category updated successfully!");
      navigate("/categories");
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "450px", position: "relative" }}>
        
        {/* ✅ Back Button  */}
        <IconButton
          onClick={() => navigate("/categories")}
          sx={{ position: "absolute", top: 15, left: 15, color: "grey" }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Edit Category
        </Typography>

        <TextField
          fullWidth
          label="Category Name"
          name="name"
          value={category.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={category.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default EditCategory;
