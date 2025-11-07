import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Box, Stack, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { userContext } from "../../context/userContext";
import CategoryTable from "./CategoryTable";
import { useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";

const Category = () => {
  const navigate = useNavigate();
  const { user: globalUser } = useContext(userContext);

  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchObj, setSearchObj] = useState({});
  const [fetchTotal, setFetchTotal] = useState(true); 

  useEffect(() => {
    fetchCategories();

  }, [page, rowsPerPage]); 
  const fetchCategories = async () => {
    try {
      let queryString = "";
      if (searchObj?.name) queryString += `&name=${searchObj.name}`;
      if (searchObj?.status) queryString += `&status=${searchObj.status}`;
      if (fetchTotal) queryString += "&fetchTotal=true";

      const res = await axios.get(
        `http://localhost:3000/category?page=${page}&rows=${rowsPerPage}${queryString}`,
        { withCredentials: true }
      );

      setCategories(res.data.data || []);
      if (res.data.total !== undefined) {
        setTotal(res.data.total);
        setFetchTotal(false); 
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSearch = () => {
    setPage(0);
    setFetchTotal(true); 
    fetchCategories();
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/category/${id}`, {
        withCredentials: true,
      });
      setFetchTotal(true);
      fetchCategories();
      toast.success("Category deleted!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (id) => navigate(`/categories/edit/${id}`);

  const handleChangePage = (newPage) => {
    setPage(newPage);
    setFetchTotal(true); 
  };

  const handleChangeRowsPerPage = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
    setFetchTotal(true); 
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
       
      <Box sx={{ padding: 5 }}>
        <Box
        sx={{ padding: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <PageHeader title="Category"  />
      </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              name="name"
              label="Search by name"
              variant="outlined"
              value={searchObj?.name || ""}
              onChange={(e) => setSearchObj({ ...searchObj, [e.target.name]: e.target.value })}
            />
          </Box>

          <Stack spacing={2} direction="row" alignItems="center">
            <Button variant="outlined" endIcon={<SearchIcon />} onClick={handleSearch}>
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

        <CategoryTable
          categories={categories}
          page={page}
          rowsPerPage={rowsPerPage}
          pageSetter={handleChangePage}
          rowsPerPageSetter={handleChangeRowsPerPage}
          length={total}
          onEdit={handleEdit}
          onDelete={deleteHandler}
        />
      </Box>

      <Box sx={{ textAlign: "center", padding: 2, color: "gray" }}>
        @all copy rights reserved
      </Box>
    </Box>
  );
};

export default Category;
