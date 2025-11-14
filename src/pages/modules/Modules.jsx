import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import {
  Box,
  Stack,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import PageHeader from "../../components/PageHeader";
import ModulesTable from "../../components/Modules/ModulesTable";

const BASE_URL = "http://localhost:3000";
import { userContext } from "../../context/userContext"

const Modules = () => {
  const navigate = useNavigate();
const { user } = useContext(userContext);
  const [modules, setmodules] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters
  const [filters, setFilters] = useState({
    searchWord: "",
    status: "all", // "all" | "true" | "false"
    from: null, 
    to: null, 
  });

  const [fetchTotal, setFetchTotal] = useState(true);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);


  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));


  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const [toggleOpen, setToggleOpen] = useState(false);
  const [toggleId, setToggleId] = useState(null);
  const [toggleNextVal, setToggleNextVal] = useState(null);

  useEffect(() => {
    fetchmodules(fetchTotal);
  }, [page, rowsPerPage, sort, order]);

  const buildQuery = (overrides = {}) => {
    const current = {
      page,
      rows: rowsPerPage,
      sort,
      order,
      ...filters,
      ...overrides,
    };

    const params = new URLSearchParams();
    params.set("page", String(current.page));
    params.set("rows", String(current.rows));
    params.set("sort", current.sort);
    params.set("order", current.order);

    if (current.searchWord?.trim())
      params.set("searchWord", current.searchWord.trim());
    if (current.status && current.status !== "")
      params.set("status", current.status);

    // Send dates as YYYY-MM-DD (backend uses dayjs(from/to).start/endOf("day"))
    if (current.from)
      params.set("from", dayjs(current.from).format("YYYY-MM-DD"));
    if (current.to) params.set("to", dayjs(current.to).format("YYYY-MM-DD"));

    // Only compute total when needed
    if (fetchTotal || overrides.fetchTotal === true)
      params.set("fetchTotal", "true");

    return `?${params.toString()}`;
  };

  const fetchmodules = async (forceTotal = false, overrides = {}) => {
    try {
      setLoading(true);
      const qs = buildQuery({ ...overrides, fetchTotal: forceTotal });
      const res = await axios.get(`${BASE_URL}/category${qs}`, {
        withCredentials: true,
      });

      const list = res?.data?.data || [];
      setmodules(list);

      if (forceTotal && typeof res.data.total === "number") {
        setTotal(res.data.total);
        setFetchTotal(false);

        const params = new URLSearchParams(qs.slice(1));
        const currentRows = Number(params.get("rows")) || rowsPerPage;
        const currentPage = Number(params.get("page")) || 0;
        const lastPage = Math.max(
          0,
          Math.ceil(res.data.total / currentRows) - 1
        );

        if (currentPage > lastPage) {
          setPage(lastPage); // triggers refetch via effect
          return;
        }
      }
    } catch (err) {
      openToast(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to load modules",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit search (Enter on any field or click Search)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(0);
    setFetchTotal(true);
    fetchmodules(true, { page: 0 });
  };

  const clearFilters = () => {
    setFilters({ searchWord: "", status: "all", from: null, to: null });
    setPage(0);
    setFetchTotal(true);
    fetchmodules(true, {
      page: 0,
      searchWord: "",
      status: "all",
      from: undefined,
      to: undefined,
    });
  };

  // Delete (soft)
  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${BASE_URL}/category/${deleteId}`, {
        withCredentials: true,
      });
      openToast("Modules deleted!", "success");
      const nextPage = modules.length === 1 && page > 0 ? page - 1 : page;
      setPage(nextPage);
      setFetchTotal(true);
      await fetchmodules(true, { page: nextPage });
    } catch (err) {
      openToast(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Delete failed",
        "error"
      );
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };

  // Toggle status
  const openToggleConfirm = (id, nextVal) => {
    setToggleId(id);
    setToggleNextVal(nextVal);
    setToggleOpen(true);
  };
  const handleToggleConfirm = async () => {
    try {
      await axios.put(
        `${BASE_URL}/category/${toggleId}`,
        { status: toggleNextVal },
        { withCredentials: true }
      );
      openToast(
        `Modules ${toggleNextVal ? "activated" : "deactivated"}`,
        "success"
      );
      await fetchmodules(false);
    } catch (err) {
      openToast(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update status",
        "error"
      );
    } finally {
      setToggleOpen(false);
      setToggleId(null);
      setToggleNextVal(null);
    }
  };
  const handleToggleCancel = () => {
    setToggleOpen(false);
    setToggleId(null);
    setToggleNextVal(null);
  };

  // Paging & sorting
  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (newRows) => {
    const r = Number(newRows) || 10;
    setRowsPerPage(r);
    setPage(0);
    setFetchTotal(true);
    fetchmodules(true, { rows: r, page: 0 });
  };
  const handleSort = (field) => {
    const nextOrder =
      sort === field ? (order === "asc" ? "desc" : "asc") : "asc";
    setSort(field);
    setOrder(nextOrder);
    setPage(0);
    setFetchTotal(true);
    fetchmodules(true, { sort: field, order: nextOrder, page: 0 });
  };

  const handleEdit = (id) => navigate(`/modules/edit/${id}`);

  return (
    // Full-height column; footer appears after content, sticks to bottom if short
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontSize: "0.85rem",
        mt: 1,
        p: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 1,
          bgcolor: "background.paper",

          px: 2,

          pb: 1,
        }}
      >
        <PageHeader
          title="modules"
          crumbs={[{ label: "modules" }]}
          fontSize="1rem"
        />
        <Divider sx={{ my: 1 }} />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
              mt: 2.1,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Tooltip title="Search by name or description" arrow>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={filters.searchWord}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, searchWord: e.target.value }))
                  }
                  sx={{ minWidth: 240 }}
                />
              </Tooltip>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  label="Status"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>

              <DatePicker
                label="Created From"
                value={filters.from}
                onChange={(val) => setFilters((f) => ({ ...f, from: val }))}
                slotProps={{ textField: { size: "small" } }}
                format="DD/MM/YYYY"
              />

              <DatePicker
                label="Created To"
                value={filters.to}
                onChange={(val) => setFilters((f) => ({ ...f, to: val }))}
                slotProps={{ textField: { size: "small" } }}
                format="DD/MM/YYYY"
              />
            </Stack>

            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                type="submit"
                variant="outlined"
                endIcon={<SearchIcon />}
                sx={{
                  borderColor: "grey.800",
                  color: "grey.800",
                  "&:hover": { borderColor: "grey.900", color: "grey.900" },
                }}
              >
                Search
              </Button>

              <Button type="button" variant="outlined" onClick={clearFilters}>
                Clear
              </Button>

              {user?.permissions["modules"].includes("write") ? (
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  onClick={() => navigate("/modules/add")}
                  sx={{
                    bgcolor: "grey.800",
                    color: "secondary",
                    // color: "common.white",
                    "&:hover": { bgcolor: "grey.900" },
                  }}
                >
                  Add
                </Button>
              ) : null}
            </Stack>
          </Box>
        </LocalizationProvider>
      </Box>

      <Box sx={{ flex: 1, px: 2, pb: 2 }}>
        <ModulesTable
          modules={modules}
          page={page}
          rowsPerPage={rowsPerPage}
          pageSetter={setPage}
          rowsPerPageSetter={handleChangeRowsPerPage}
          length={total}
          onEdit={handleEdit}
          onDelete={openDeleteConfirm}
          onToggle={openToggleConfirm}
          sort={sort}
          order={order}
          onSort={handleSort}
          loading={loading}
        />
      </Box>

      <Box
        component="footer"
        sx={{
          mt: "auto",
          width: "100%",
          bgcolor: "grey.300",
          color: "text.primary",
          textAlign: "center",
          lineHeight: "40px",
          height: 40,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        © {new Date().getFullYear()} ecom
      </Box>

      <Dialog
        open={deleteOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Modules?</DialogTitle>
        <DialogContent>This will mark the category as deleted.</DialogContent>
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
          {toggleNextVal ? "Activate Modules?" : "Deactivate Modules?"}
        </DialogTitle>
        <DialogContent>
          {toggleNextVal
            ? "You’re activating this category. Continue?"
            : "You’re deactivating this category. Are you sure?"}
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

export default Modules;
