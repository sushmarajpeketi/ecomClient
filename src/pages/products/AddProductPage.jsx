// src/pages/products/AddProductPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const BASE_URL = "http://localhost:3000";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",     // will hold the category id (string)
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(false);

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const openToast = (message, severity = "success") => setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    (async () => {
      setCatsLoading(true);
      try {
        // pull only active, not-deleted categories (optional but sensible)
        const res = await axios.get(`${BASE_URL}/category?rows=100&status=true`, { withCredentials: true });
        const raw = Array.isArray(res?.data?.data) ? res.data.data : [];

        // Normalize ids so UI uses a consistent key/value
        // backend returns { id, ... } (not _id)
        const list = raw.map((c) => ({
          id: c.id || c._id,        // support either shape just in case
          name: c.name,
        }));
        setCategories(list);
      } catch (e) {
        openToast(
          e?.response?.data?.message || e?.response?.data?.error || "Failed to load categories",
          "error"
        );
      } finally {
        setCatsLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await axios.post(`${BASE_URL}/products/upload-image`, fd, { withCredentials: true });
      const imageUrl = res.data?.url;
      setForm((s) => ({ ...s, image: imageUrl }));
      setPreview(URL.createObjectURL(file));
      openToast("Image uploaded", "success");
    } catch (err) {
      openToast(
        err?.response?.data?.message || err?.response?.data?.error || "Image upload failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category) {
      openToast("Please fill name, price and category", "warning");
      return;
    }
    setLoading(true);
    const payload = { ...form, price: Number(form.price) };
    try {
      await axios.post(`${BASE_URL}/products/create-product`, payload, { withCredentials: true });
      openToast("Product added successfully!", "success");
      setTimeout(() => navigate("/products"), 600);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || "Failed to add product";
      openToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const addEnabled = !loading && !!form.name && !!form.price && !!form.category;

  const crumbs = [
    { label: "Products", to: "/products" },
    { label: "Add Product" },
  ];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", fontSize: "0.85rem" }}>
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
        <PageHeader title="Add Product" crumbs={crumbs} fontSize="1rem" />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2, mt: 7 }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Card sx={{ width: "90%", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Product Details
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />

                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="category"
                    value={form.category}                 // should be the id string
                    onChange={handleChange}
                    disabled={catsLoading}
                    MenuProps={{ PaperProps: { style: { maxHeight: 240 } } }}
                  >
                    {categories.length === 0 ? (
                      <MenuItem disabled value="">
                        {catsLoading ? "Loading..." : "No categories"}
                      </MenuItem>
                    ) : (
                      categories.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    border: "1px solid lightgray",
                    borderRadius: "9px",
                    p: 1.25,
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ width: "30%" }}
                    disabled={loading}
                  >
                    Upload Image
                    <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                  </Button>

                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            width: "90%",
            mx: "auto",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 5,
          }}
        >
          <Button variant="outlined" sx={{ width: 90 }} onClick={() => navigate("/products")}>
            Cancel
          </Button>
          <Button variant="contained" disabled={!addEnabled} onClick={handleAdd} sx={{ width: 90 }}>
            {loading ? "Adding..." : "Add"}
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

export default AddProductPage;
