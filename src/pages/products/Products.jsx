import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ProductsTable from "../../components/Products/ProductsTable";
import { userContext } from "../../context/userContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import PageHeader from "../../components/PageHeader";

const Products = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [searchObj, setSearchObj] = useState({
    name: "",
    createdAt: null,
    priceMin: "",
    priceMax: "",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const buildQuery = (fetchTotalParam = true, overrides = {}) => {
    const p = new URLSearchParams();
    const current = {
      page,
      rows: rowsPerPage,
      sort,
      order,
      searchObj,
      ...overrides,
    };
    p.set("page", current.page);
    p.set("rows", current.rows);
    p.set("sort", current.sort);
    p.set("order", current.order);
    if (current.searchObj.name) p.set("name", current.searchObj.name.trim());
    if (
      current.searchObj.createdAt &&
      dayjs(current.searchObj.createdAt).isValid()
    ) {
      p.set(
        "createdAt",
        dayjs(current.searchObj.createdAt).format("YYYY-MM-DD")
      );
    }
    if (current.searchObj.priceMin !== "")
      p.set("priceMin", current.searchObj.priceMin);
    if (current.searchObj.priceMax !== "")
      p.set("priceMax", current.searchObj.priceMax);
    if (fetchTotalParam) p.set("fetchTotal", "true");
    return `?${p.toString()}`;
  };

  const fetchProducts = async (fetchTotalParam = true, overrides = {}) => {
    setLoading(true);
    try {
      const url = `http://localhost:3000/products${buildQuery(
        fetchTotalParam,
        overrides
      )}`;
      const res = await axios.get(url, { withCredentials: true });
      setProducts(res?.data?.data || []);
      if (res?.data?.total !== undefined) setCount(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(true);
  }, []);

  const handleDeleteOpen = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await axios.delete(`http://localhost:3000/products/${deleteId}`, {
      withCredentials: true,
    });
    setDeleteOpen(false);
    const nextPage = products.length === 1 && page > 0 ? page - 1 : page;
    setPage(nextPage);
    fetchProducts(true, { page: nextPage });
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const handleSearch = () => {
    setPage(0);
    fetchProducts(true, { page: 0 });
  };

  const handleClear = () => {
    const cleared = { name: "", createdAt: null, priceMin: "", priceMax: "" };
    setSearchObj(cleared);
    setSort("createdAt");
    setOrder("desc");
    setRowsPerPage(10);
    setPage(0);
    fetchProducts(true, {
      page: 0,
      rows: 10,
      sort: "createdAt",
      order: "desc",
      searchObj: cleared,
    });
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
    fetchProducts(true, { page: newPage });
  };

  const handleChangeRowsPerPage = (newRows) => {
    const rows = Number(newRows) || 10;
    setRowsPerPage(rows);
    setPage(0);
    fetchProducts(true, { rows, page: 0 });
  };

  const handleSort = (field) => {
    let nextOrder = "asc";
    if (sort === field) nextOrder = order === "asc" ? "desc" : "asc";
    else nextOrder = field === "createdAt" ? "desc" : "asc";
    setSort(field);
    setOrder(nextOrder);
    setPage(0);
    fetchProducts(true, { sort: field, order: nextOrder, page: 0 });
  };

  const handleEditNavigate = (id) => navigate(`/products/edit/${id}`);
  const handleAddNavigate = () => navigate("/products/add");

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{ px: 2, pt: 1, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <PageHeader title="Products" crumbs={[{ label: "Products" }]} />
      </Box>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mt: 2, flexWrap: "wrap" }}
        mr={2}
        ml={2}
      >
        <TextField
          label="Product name"
          size="small"
          value={searchObj.name}
          onChange={(e) =>
            setSearchObj((s) => ({ ...s, name: e.target.value }))
          }
          sx={{ minWidth: 240 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Created on"
            value={searchObj.createdAt || null}
            onChange={(v) => setSearchObj((s) => ({ ...s, createdAt: v }))}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>
        <TextField
          label="Min price"
          size="small"
          type="number"
          value={searchObj.priceMin}
          onChange={(e) =>
            setSearchObj((s) => ({ ...s, priceMin: e.target.value }))
          }
          sx={{ width: 140 }}
        />
        <TextField
          label="Max price"
          size="small"
          type="number"
          value={searchObj.priceMax}
          onChange={(e) =>
            setSearchObj((s) => ({ ...s, priceMax: e.target.value }))
          }
          sx={{ width: 140 }}
        />
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Button
            variant="outlined"
            size="medium"
            onClick={handleSearch}
            endIcon={<SearchIcon />}
            sx={{
              borderColor: "grey.800",
              color: "grey.800",
              "&:hover": { borderColor: "grey.900", color: "grey.900" },
            }}
          >
            Search
          </Button>
          <Button variant="outlined" size="medium" onClick={handleClear}>
            Clear
          </Button>
          {user?.role === "admin" && (
            <Button
              variant="contained"
              size="medium"
              onClick={handleAddNavigate}
              endIcon={<AddIcon />}
            >
              Add
            </Button>
          )}
        </Stack>
      </Stack>

      <Box sx={{ flex: 1, overflow: "auto", px: 2, pt: 2, pb: 2 }}>
        <ProductsTable
          products={products}
          page={page}
          rowsPerPage={rowsPerPage}
          pageSetter={handleChangePage}
          rowsPerPageSetter={handleChangeRowsPerPage}
          length={count}
          loading={loading}
          sort={sort}
          order={order}
          onSort={handleSort}
          onDelete={handleDeleteOpen}
          onEdit={handleEditNavigate}
        />
      </Box>

      <Dialog
        open={deleteOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Product?</DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          mt: 1,
          textAlign: "center",
          py: 1,
          fontSize: "0.8rem",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        © {new Date().getFullYear()} ecom
      </Box>
    </Box>
  );
};

export default Products;
