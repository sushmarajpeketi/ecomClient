// src/pages/products/Products.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ProductsTable from "../../components/Products/ProductsTable";
import { userContext } from "../../context/userContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PageHeader from "../../components/PageHeader";

const CONTROL_H = 36;
const FIELD_W = 120;
const BTN_MIN_W = 82;
const BASE_URL = "http://localhost:3000";

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
    q: "",
    category: "",
    from: null,
    to: null,
    priceMin: "",
    priceMax: "",
  });

  const [categories, setCategories] = useState([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [toggleOpen, setToggleOpen] = useState(false);
  const [toggleId, setToggleId] = useState(null);
  const [toggleNextVal, setToggleNextVal] = useState(null);

  const toggleProduct = useMemo(
    () => products.find((p) => p?._id === toggleId),
    [products, toggleId]
  );

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
    if (current.searchObj.q?.trim()) p.set("q", current.searchObj.q.trim());
    if (current.searchObj.category?.trim())
      p.set("category", current.searchObj.category.trim());
    if (current.searchObj.from && dayjs(current.searchObj.from).isValid()) {
      p.set("from", dayjs(current.searchObj.from).startOf("day").toISOString());
    }
    if (current.searchObj.to && dayjs(current.searchObj.to).isValid()) {
      p.set("to", dayjs(current.searchObj.to).endOf("day").toISOString());
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
      const url = `${BASE_URL}/products${buildQuery(
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

  const fetchCategories = async () => {
    const res = await axios.get(`${BASE_URL}/category`, {
      withCredentials: true,
    });
    const arr = Array.isArray(res?.data?.data) ? res.data.data : res.data || [];
    setCategories(arr.map((c) => ({ id: c.id || c._id, name: c.name })));
  };

  useEffect(() => {
    fetchProducts(true);
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      fetchProducts(true, { page: 0 });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchObj.from, searchObj.to]);

  const handleDeleteOpen = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await axios.delete(`${BASE_URL}/products/${deleteId}`, {
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

  const triggerSearch = () => {
    setPage(0);
    fetchProducts(true, { page: 0 });
  };

  const handleClear = () => {
    const cleared = {
      q: "",
      category: "",
      from: null,
      to: null,
      priceMin: "",
      priceMax: "",
    };
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

  const handleToggleOpen = (id, nextVal) => {
    setToggleId(id);
    setToggleNextVal(nextVal);
    setToggleOpen(true);
  };

  const handleToggleConfirm = async () => {
    await axios.put(
      `${BASE_URL}/products/${toggleId}`,
      { status: toggleNextVal },
      { withCredentials: true }
    );
    setToggleOpen(false);
    setToggleId(null);
    setToggleNextVal(null);
    fetchProducts(false);
  };

  const handleToggleCancel = () => {
    setToggleOpen(false);
    setToggleId(null);
    setToggleNextVal(null);
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
    // Full-height column so the footer sits at the bottom when content is short,
    // and appears after the table when content is long.
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Sticky top block: Header + Divider + Filters */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 1,
          bgcolor: "background.paper",
          px: 2,
          pt: 1,
          pb: 1,
          // borderBottom: "1px solid",
          // borderColor: "divider",
        }}
      >
        <PageHeader title="Products" crumbs={[{ label: "Products" }]} />
        <Divider sx={{ my: 1 }} />

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            triggerSearch();
          }}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            mt: 1.9,
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            useFlexGap
            sx={{
              flexWrap: "wrap",
              rowGap: 0.9,
              columnGap: 0.75,
              "& > *": { flex: "0 0 auto" },
            }}
          >
            <Tooltip title="Search by name, description, category, price" arrow>
              <TextField
                label="Search"
                size="small"
                value={searchObj.q}
                onChange={(e) =>
                  setSearchObj((s) => ({ ...s, q: e.target.value }))
                }
                sx={{
                  width: FIELD_W,
                  "& .MuiInputBase-root": { height: CONTROL_H },
                }}
              />
            </Tooltip>

            <FormControl
              size="small"
              sx={{
                width: FIELD_W,
                "& .MuiInputBase-root": { height: CONTROL_H },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={searchObj.category}
                onChange={(e) =>
                  setSearchObj((s) => ({ ...s, category: e.target.value }))
                }
                MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From"
                value={searchObj.from}
                onChange={(v) => setSearchObj((s) => ({ ...s, from: v }))}
                format="DD MMM"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      width: FIELD_W,
                      "& .MuiInputBase-root": { height: CONTROL_H },
                    },
                  },
                }}
              />
              <DatePicker
                label="To"
                value={searchObj.to}
                onChange={(v) => setSearchObj((s) => ({ ...s, to: v }))}
                format="DD MMM"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      width: FIELD_W,
                      "& .MuiInputBase-root": { height: CONTROL_H },
                    },
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              label="Min"
              size="small"
              type="number"
              value={searchObj.priceMin}
              onChange={(e) =>
                setSearchObj((s) => ({ ...s, priceMin: e.target.value }))
              }
              sx={{
                width: FIELD_W,
                "& .MuiInputBase-root": { height: CONTROL_H },
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />

            <TextField
              label="Max"
              size="small"
              type="number"
              value={searchObj.priceMax}
              onChange={(e) =>
                setSearchObj((s) => ({ ...s, priceMax: e.target.value }))
              }
              sx={{
                width: FIELD_W,
                "& .MuiInputBase-root": { height: CONTROL_H },
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Stack>

          <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap>
            <Box sx={{ width: 12, flex: "0 0 auto" }} />
            <Button
              type="submit"
              variant="outlined"
              size="small"
              endIcon={<SearchIcon />}
              sx={{ height: CONTROL_H, minWidth: BTN_MIN_W }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClear}
              sx={{ height: CONTROL_H, minWidth: BTN_MIN_W }}
            >
              Clear
            </Button>

            {user?.permissions["products"].includes("write") ? (
              <Button
                variant="contained"
                size="small"
                onClick={handleAddNavigate}
                endIcon={<AddIcon />}
                sx={{ height: CONTROL_H, minWidth: BTN_MIN_W }}
              >
                Add
              </Button>
            ) : null}
          </Stack>
        </Box>
      </Box>

      {/* Main scroll content (table) — naturally goes under the sticky block */}
      <Box sx={{ flex: 1, px: 2, pb: 2, overflowX: "auto" }}>
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
          onToggle={handleToggleOpen}
        />
      </Box>

      {/* Dialogs */}
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

      <Dialog
        open={toggleOpen}
        onClose={handleToggleCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {toggleNextVal ? "Activate Product?" : "Deactivate Product?"}
        </DialogTitle>
        <DialogContent>
          {toggleNextVal ? (
            <>
              You’re activating <b>{toggleProduct?.name ?? "this product"}</b>.
              Continue?
            </>
          ) : (
            <>
              You’re deactivating <b>{toggleProduct?.name ?? "this product"}</b>
              . Are you sure?
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleCancel}>Cancel</Button>
          <Button
            color={toggleNextVal ? "primary" : "error"}
            variant="contained"
            onClick={handleToggleConfirm}
          >
            {toggleNextVal ? "Activate" : "Deactivate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer — not fixed. It appears after the table; if content is short, it sits at the bottom. */}
      <Box
        component="footer"
        sx={{
          mt: "auto",
          px: 2,
          height: 40,
          lineHeight: "40px",
          textAlign: "center",
          bgcolor: "background.paper",
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
