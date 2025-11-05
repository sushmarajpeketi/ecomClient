import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export default function AddCategory() {
  const navigate = useNavigate();

  const [cat, setCat] = useState({
    name: "",
    description: "",
  });

  const changeHandler = (e) => {
    setCat({ ...cat, [e.target.name]: e.target.value });
  };
  async function addCategory(cat) {
    try {
      const res = await axios.post(`http://localhost:3000/category/create-category`, cat, {
        withCredentials: true,
      });
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.message);
    }
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    await addCategory(cat);

    // toast.success("Category added successfully!");

    setTimeout(() => {
      navigate("/categories");
    }, 1200);
  };

  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        name="name"
        label="Category Name"
        required
        value={cat.name}
        onChange={changeHandler}
      />

      <TextField
        name="description"
        label="Description"
        value={cat.description}
        onChange={changeHandler}
      />

      <Button type="submit" variant="contained">
        Add Category
      </Button>
      <Button variant="outlined" onClick={() => navigate("/categories")}>
        Back
      </Button>
    </Box>
  );
}
