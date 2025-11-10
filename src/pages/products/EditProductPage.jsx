// src/pages/products/EditProductPage.jsx
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
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const BASE_URL = "http://localhost:3000";

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

  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    (async () => {
      setCatsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/category?rows=100`, {
          withCredentials: true,
        });
        const list = res?.data?.data ?? [];
        setCategories(Array.isArray(list) ? list : []);
      } catch (e) {
        openToast(
          e?.response?.data?.message ||
            e?.response?.data?.error ||
            "Failed to load categories",
          "error"
        );
      } finally {
        setCatsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/products/${id}`, {
        withCredentials: true,
      });
      const product = res.data?.data || res.data;
      const categoryValue =
        typeof product?.category === "object"
          ? product?.category?.name || ""
          : product?.category || "";
      setForm({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price ?? "",
        category: categoryValue,
        image: product?.image || null,
      });
      setPreview(product?.image || null);
      openToast("Product loaded", "success");
    } catch (e) {
      openToast(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Failed to load product",
        "error"
      );
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
      const res = await axios.post(`${BASE_URL}/products/upload-image`, fd, {
        withCredentials: true,
      });
      const imageUrl = res.data?.url;
      setForm((s) => ({ ...s, image: imageUrl }));
      setPreview(URL.createObjectURL(file));
      openToast("Image uploaded", "success");
    } catch (err) {
      openToast(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Image upload failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      openToast("Please fill name, price and category", "warning");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/products/${id}`, form, {
        withCredentials: true,
      });
      openToast("Product updated successfully!", "success");
      setTimeout(() => navigate("/products"), 600);
    } catch (e) {
      openToast(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Failed to update product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const saveEnabled =
    !loading && !!form.name && !!form.price && !!form.category;

  const crumbs = [{ label: "Products", to: "/products" }, { label: "Edit Product" }];

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
        <PageHeader title="Edit Product" crumbs={crumbs} fontSize="1rem" />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Card sx={{ width: "60%", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Product Details
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
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
                    value={form.category}
                    onChange={handleChange}
                    disabled={catsLoading}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 240 } },
                    }}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c._id} value={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="outlined" component="label" fullWidth disabled={loading} size="small">
                  Upload Image
                  <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                </Button>

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
          <Button variant="outlined" onClick={() => navigate("/products")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!saveEnabled}
            onClick={handleSave}
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
};

export default EditProductPage;
