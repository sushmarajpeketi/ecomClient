// src/pages/categories/Category.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Box, Stack, TextField, Button, Snackbar, Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { userContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

import CategoryTable from './../../components/Categories/CategoryTable';
const Category = () => {
  const navigate = useNavigate();
  const { user: globalUser } = useContext(userContext);

  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchObj, setSearchObj] = useState({});
  const [fetchTotal, setFetchTotal] = useState(true);

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    fetchCategories(fetchTotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, sort, order]);

  const fetchCategories = async (forceTotal = false, overrides = {}) => {
    try {
      const current = {
        page,
        rows: rowsPerPage,
        sort,
        order,
        ...overrides,
      };

      let qs = `?page=${current.page}&rows=${
        current.rows
      }&sort=${encodeURIComponent(current.sort)}&order=${encodeURIComponent(
        current.order
      )}`;

      const name = overrides.searchObj?.name ?? searchObj?.name;
      const status = overrides.searchObj?.status ?? searchObj?.status;

      if (name) qs += `&name=${encodeURIComponent(name)}`;
      if (status !== undefined && status !== "")
        qs += `&status=${encodeURIComponent(status)}`;

      if (forceTotal || fetchTotal) qs += "&fetchTotal=true";

      const res = await axios.get(`http://localhost:3000/category${qs}`, {
        withCredentials: true,
      });

      const list = res?.data?.data || [];
      setCategories(list);

      if ("total" in res.data && res.data.total !== undefined) {
        setTotal(res.data.total);
        setFetchTotal(false);

        const lastPage = Math.max(
          0,
          Math.ceil(res.data.total / current.rows) - 1
        );
        if (current.page > lastPage) {
          setPage(lastPage);
          return; // useEffect will refetch with the corrected page
        }
      }
    } catch (err) {
      openToast(
        err?.response?.data?.error ||
          err.message ||
          "Failed to load categories",
        "error"
      );
    }
  };

  const handleSearch = () => {
    const next = { page: 0 };
    setPage(next.page);
    setFetchTotal(true);
    fetchCategories(true, next);
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/category/${id}`, {
        withCredentials: true,
      });
      setFetchTotal(true);
      fetchCategories(true);
      openToast("Category deleted!", "success");
    } catch (err) {
      openToast(
        err?.response?.data?.error || err.message || "Delete failed",
        "error"
      );
    }
  };

  const handleEdit = (id) => navigate(`/categories/edit/${id}`);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRows) => {
    const rows = Number(newRows) || 10;
    setRowsPerPage(rows);
    setPage(0);
    setFetchTotal(true);
    fetchCategories(true, { rows, page: 0 });
  };

  const handleSort = (field) => {
    const nextOrder =
      sort === field ? (order === "asc" ? "desc" : "asc") : "asc";
    setSort(field);
    setOrder(nextOrder);
    setPage(0);
    setFetchTotal(true);
    fetchCategories(true, { sort: field, order: nextOrder, page: 0 });
  };

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
        <PageHeader
          title="Categories"
          crumbs={[{ label: "Categories" }]}
          fontSize="1rem"
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              name="name"
              label="Search by name"
              variant="outlined"
              size="small"
              value={searchObj?.name || ""}
              onChange={(e) =>
                setSearchObj({ ...searchObj, [e.target.name]: e.target.value })
              }
            />
          </Box>

          <Stack spacing={2} direction="row" alignItems="center">
            <Button
              variant="outlined"
              endIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{
                borderColor: "grey.800",
                color: "grey.800",
                "&:hover": { borderColor: "grey.900", color: "grey.900" },
              }}
            >
              Search
            </Button>

            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => navigate("/categories/add")}
              sx={{
                bgcolor: "grey.800",
                color: "common.white",
                "&:hover": { bgcolor: "grey.900" },
              }}
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
          sort={sort}
          order={order}
          onSort={handleSort}
        />
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

export default Category;
