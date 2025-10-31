import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
const EditProductCard = ({ product, onSave, onCancel, id }) => {
  let [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
  
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
      });

      setPreview(product.image);
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("img", file);
    try {
      
      const res = await axios.post(
        `http://localhost:3000/products/upload-image`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = res.data.url;
      setForm({ ...form, image: imageUrl });
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }

    setPreview(URL.createObjectURL(file));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Edit Product</Typography>

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

      <Button variant="outlined" component="label">
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Button>
      <div style={{margin:"auto"}}>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "50px", borderRadius: "8px", objectFit: "cover" }}
          />
        )}
      </div>

      <Button
        variant="contained"
        loading={loading}
        onClick={() => onSave(form)}
      >
        Save
      </Button>
      <Button variant="outlined" color="error" onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
};

export default EditProductCard;
