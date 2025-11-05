import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Box, Stack, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { userContext } from "../../context/userContext";
import CategoryTable from "./CategoryTable";
import { useNavigate } from "react-router-dom";
import AddCategory from "./AddCategory";




const Category = () => {
  const navigate = useNavigate();

  const { user: globalUser } = useContext(userContext);

  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchObj, setSearchObj] = useState({});
  const [isChangeInFilter, setIsChangeInFilter] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [page]);

  useEffect(() => {
    setIsChangeInFilter(true);
    fetchCategories();
  }, [rowsPerPage]);

  const pageSetter = (newPage) => setPage(newPage);
  const rowsPerPageSetter = (val) => {
    setRowsPerPage(val);
    setPage(0);
  };


  async function fetchCategories() {
    try {
      let queryString = ``;

      if (searchObj?.name) queryString += `&name=${searchObj?.name}`;
      if (searchObj?.status) queryString += `&status=${searchObj?.status}`;

      if (isChangeInFilter) queryString += `&fetchTotal=true`;

      const res = await axios.get(
        `http://localhost:3000/category?page=${page}&rows=${rowsPerPage}${queryString}`,
        { withCredentials: true }
      );

      setCategories(res.data.data);
      if (res.data.total) {
        setTotal(res.data.total);
        setIsChangeInFilter(false);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }



  const deleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/category/${id}`, {
        withCredentials: true,
      });
      fetchCategories();
      toast.success("Category deleted!");
    } catch (err) {
      toast.error(err.message);
    }
  };
const handleEdit = (id) => {
  navigate(`/categories/edit/${id}`);
};
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ padding: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* ✅ Filters */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              name="name"
              label="Search by name"
              variant="outlined"
              value={searchObj?.name || ""}
              onChange={(e) => {
                setSearchObj({ ...searchObj, [e.target.name]: e.target.value });
                setIsChangeInFilter(true);
              }}
            />
          </Box>

          <Stack spacing={2} direction="row" alignItems="center">
            <Button
              variant="outlined"
              endIcon={<SearchIcon />}
              onClick={() => {
                setPage(0);
                setIsChangeInFilter(true);
                fetchCategories();
              }}
            >
              Search
            </Button>

            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => navigate("/categories/add")}
            >
              Add
            </Button>
          </Stack>
        </Box>

        {/* ✅ Table */}
        <CategoryTable
          categories={categories}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageSetter={rowsPerPageSetter}
          pageSetter={pageSetter}
          length={total}
          onEdit={handleEdit}
          onDelete={deleteHandler}
        //   onAdd={addCategory}
        />
      </Box>

      <Box sx={{ textAlign: "center", padding: 2, color: "gray" }}>
        @all copy rights reserved
      </Box>
    </Box>
  );
};

export default Category;
