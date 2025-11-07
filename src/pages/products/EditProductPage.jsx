import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadProduct();
   
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/products/${id}`, {
        withCredentials: true,
      });
      const product = res.data?.data || res.data;
      setForm({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        category: product?.category || "",
        image: product?.image || null,
      });
      setPreview(product?.image || null);
    } catch (e) {
      console.error("load product", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await axios.post(
        "http://localhost:3000/products/upload-image",
        fd,
        { withCredentials: true }
      );
      const imageUrl = res.data?.url;
      setForm((s) => ({ ...s, image: imageUrl }));
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      console.error("upload error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/products/${id}`, form, {
        withCredentials: true,
      });
      navigate("/products");
    } catch (e) {
      console.error("update product", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <PageHeader
        title="Edit Products"
        crumbs={[
          { label: "Products", to: "/products" },
          { label: "Edit Product" },
        ]}
      />

      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card sx={{ width: "60%", p: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Product Details
            </Typography>

           
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
              }}
            >
          
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

    
              <Box sx={{ display: "flex", flexDirection: "row", border:"1px solid lightgray",borderRadius:"10px",justifyContent:"space-around"}}>
                <Box sx={{margin:"auto"}}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={loading}
                  >
                    Upload Image
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />
                  )}
                </Box>
              </Box>
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
        <Button variant="outlined" onClick={() => navigate("/products")}>
          Cancel
        </Button>
        <Button variant="contained" disabled={loading} onClick={handleSave}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditProductPage;
