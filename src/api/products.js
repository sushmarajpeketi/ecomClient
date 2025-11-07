
import axios from "axios";

export const fetchProducts = (query) => axios.get(`http://localhost:3000/products${query}`, { withCredentials: true });
export const getProductById = (id) => axios.get(`http://localhost:3000/products/${id}`, { withCredentials: true });
export const createProduct = (data) => axios.post(`http://localhost:3000/products/create-product`, data, { withCredentials: true });
export const updateProduct = (id, data) => axios.put(`http://localhost:3000/products/${id}`, data, { withCredentials: true });
export const deleteProduct = (id) => axios.delete(`http://localhost:3000/products/${id}`, { withCredentials: true });
export const uploadImage = (fd) => axios.post(`http://localhost:3000/products/upload-image`, fd, { headers: { "Content-Type": "multipart/form-data" }});
