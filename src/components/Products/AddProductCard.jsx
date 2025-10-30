import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";

const AddProductCard = ({ open, onClose, onAddSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null, 
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const fd = new FormData();
    fd.append("img", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/products/upload-image", 
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = res.data?.url;
      console.log("image",imageUrl)
      setForm((prev) => ({ ...prev, image: imageUrl }));
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      console.log("Image upload error:", err);
    }

    setLoading(false);
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("Please fill required fields!");
      return;
    }

    setLoading(true);

    try {
      console.log(form)
      await axios.post("http://localhost:3000/products/create-product", form, {
        withCredentials: true,
      });

      onAddSuccess();
      onClose();

      // reset
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
      setPreview(null);
    } catch (err) {
      console.log("Add product error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 430,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 600 }}>
          Add Product
        </Typography>

        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          fullWidth
        />

        {/* ✅ Image Upload */}
        <Button variant="outlined" component="label">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>

        {/* ✅ Image Preview */}
        <div style={{ margin: "auto" }}>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={handleAddProduct}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddProductCard;
