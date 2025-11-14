// src/pages/roles/Roles.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider,
} from "@mui/material";
import { userContext } from "../../context/userContext";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import RolesTable from "../../components/roles/RolesTable";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";
const OPERATIONS = ["read", "write", "delete"];

const Roles = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [searchObj, setSearchObj] = useState({
    searchWord: "",
    from: null,
    to: null,
    isActive: "",
  });

  // toast
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const openToast = (m, s = "success") =>
    setToast({ open: true, message: m, severity: s });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  // status toggle confirm
  const [toggleOpen, setToggleOpen] = useState(false);
  const [toggleId, setToggleId] = useState(null);
  const [toggleNextVal, setToggleNextVal] = useState(null);

  const buildQuery = (fetchTotalParam = true, overrides = {}) => {
    const current = { page, rows: rowsPerPage, sort, order, ...overrides };
    const p = new URLSearchParams();
    p.set("page", current.page);
    p.set("rows", current.rows);
    p.set("sort", current.sort);
    p.set("order", current.order);

    const so = overrides.searchObj ?? searchObj;
    if (so.searchWord?.trim()) p.set("searchWord", so.searchWord.trim());
    if (so.from) p.set("from", dayjs(so.from).format("YYYY-MM-DD"));
    if (so.to) p.set("to", dayjs(so.to).format("YYYY-MM-DD"));
    if (so.isActive !== "") p.set("isActive", so.isActive);

    if (fetchTotalParam) p.set("fetchTotal", "true");
    return `?${p.toString()}`;
  };

  const fetchRoles = async (fetchTotalParam = true, overrides = {}) => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/roles${buildQuery(fetchTotalParam, overrides)}`;
      const res = await axios.get(url, { withCredentials: true });
      const data = res?.data?.data || [];
      setRoles(data);
      if (res?.data?.total !== undefined) setCount(res.data.total);
      else if (fetchTotalParam) setCount(data.length);
    } catch (e) {
      openToast(
        e?.response?.data?.error || e.message || "Failed to load roles",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(true);
  }, []);

  const handleClearAll = () => {
    const initial = {
      page: 0,
      rows: 10,
      sort: "createdAt",
      order: "desc",
      searchObj: { searchWord: "", from: null, to: null, isActive: "" },
    };
    setSearchObj(initial.searchObj);
    setSort(initial.sort);
    setOrder(initial.order);
    setRowsPerPage(initial.rows);
    setPage(initial.page);
    fetchRoles(true, initial);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
    fetchRoles(true, { page: newPage });
  };

  const handleChangeRowsPerPage = (newRows) => {
    const rows = Number(newRows) || 10;
    setRowsPerPage(rows);
    setPage(0);
    fetchRoles(true, { rows, page: 0 });
  };

  const handleSort = (field) => {
    let nextOrder = "asc";
    if (sort === field) nextOrder = order === "asc" ? "desc" : "asc";
    else nextOrder = field === "createdAt" ? "desc" : "asc";
    setSort(field);
    setOrder(nextOrder);
    setPage(0);
    fetchRoles(true, { sort: field, order: nextOrder, page: 0 });
  };

  const allowedOps = useMemo(() => OPERATIONS, [searchObj.module]);

  // status toggle
  const openToggleConfirm = (id, nextVal) => {
    setToggleId(id);
    setToggleNextVal(nextVal);
    setToggleOpen(true);
  };
  const handleToggleConfirm = async () => {
    try {
      await axios.put(
        `${BASE_URL}/roles/edit/${toggleId}`,
        { isActive: toggleNextVal },
        { withCredentials: true }
      );
      openToast(
        `Role ${toggleNextVal ? "activated" : "deactivated"}`,
        "success"
      );
      await fetchRoles(false);
    } catch (e) {
      openToast(
        e?.response?.data?.error || e.message || "Failed to update status",
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

  const handleView = (id) => navigate(`/roles/view/${id}`);
  const handleEdit = (id) => navigate(`/roles/edit/${id}`);

  return (
    // Full-height column; sticky header+filters; table underneath; footer after content
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Sticky block: Header + Divider + Filters */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 1,
          bgcolor: "background.paper",
          // borderBottom: "1px solid",
          // borderColor: "divider",
          px: 2,
          mt: 1,
          // pt:1,
          pb: 1,
        }}
      >
        <PageHeader title="Roles" crumbs={[{ label: "Roles" }]} />
        <Divider sx={{ my: 1 }} />

        {/* Filters inside sticky block */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            width: "100%",
            mt: 2.1,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            width="100%"
            sx={{
              // mt:1,
              rowGap: 1.5,
              "& .MuiFormControl-root, & .MuiTextField-root": {
                minWidth: { xs: 200, sm: 220 },
              },
            }}
          >
            <Tooltip title="Search by name and description" arrow>
              <TextField
                name="searchWord"
                label="Search"
                value={searchObj.searchWord}
                onChange={(e) =>
                  setSearchObj((s) => ({ ...s, searchWord: e.target.value }))
                }
                size="small"
              />
            </Tooltip>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Created from"
                value={searchObj.from || null}
                onChange={(v) => setSearchObj((s) => ({ ...s, from: v }))}
                slotProps={{ textField: { size: "small" } }}
              />
              <DesktopDatePicker
                label="Created to"
                value={searchObj.to || null}
                onChange={(v) => setSearchObj((s) => ({ ...s, to: v }))}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>

            <FormControl size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={searchObj.isActive}
                onChange={(e) =>
                  setSearchObj((s) => ({ ...s, isActive: e.target.value }))
                }
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center">
            <Button
              variant="outlined"
              size="medium"
              onClick={() => {
                setPage(0);
                fetchRoles(true, { page: 0, searchObj });
              }}
              endIcon={<SearchIcon />}
              sx={{ color: "grey.800", px: 2.5 }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              size="medium"
              onClick={handleClearAll}
              sx={{ px: 2 }}
            >
              Clear
            </Button>
            {user?.permissions["roles"].includes("write") ? (
              <Button
                variant="contained"
                size="medium"
                onClick={() => navigate("/roles/add")}
                sx={{
                  px: 2.5,
                  bgcolor: "grey.800",
                  "&:hover": { bgcolor: "grey.900" },
                }}
              >
                Add
              </Button>
            ) : null}
          </Stack>
        </Box>
      </Box>

      {/* Main scroll content (table) – goes UNDER the sticky block */}
      <Box sx={{ flex: 1, px: 2, pb: 2 }}>
        <RolesTable
          roles={roles}
          page={page}
          rowsPerPage={rowsPerPage}
          pageSetter={handleChangePage}
          rowsPerPageSetter={handleChangeRowsPerPage}
          length={count}
          loading={loading}
          sort={sort}
          order={order}
          onSort={handleSort}
          onToggle={openToggleConfirm}
          onView={handleView}
          onEdit={handleEdit}
        />
      </Box>

      {/* Status confirmation */}
      <Dialog
        open={toggleOpen}
        onClose={handleToggleCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {toggleNextVal ? "Activate Role?" : "Deactivate Role?"}
        </DialogTitle>
        <DialogContent>
          {toggleNextVal ? (
            <>You’re activating this role. Continue?</>
          ) : (
            <>You’re deactivating this role. Are you sure?</>
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

      {/* Footer — not fixed; appears after table; sticks to bottom when content is short */}
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
    </Box>
  );
};

export default Roles;
