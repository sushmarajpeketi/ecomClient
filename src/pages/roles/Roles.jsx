import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import RolesTable from "../../components/roles/RolesTable";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";

const MODULES = ["users", "products", "dashboard", "categories"];
const OPERATIONS = ["read", "write", "delete"];

const Roles = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [searchObj, setSearchObj] = useState({
    name: "",
    createdAt: null,
    module: "",
    operation: "",
    isActive: "",
  });

  const [nameFocused, setNameFocused] = useState(false);

  const buildQuery = (fetchTotalParam = true, overrides = {}) => {
    const current = {
      page,
      rows: rowsPerPage,
      sort,
      order,
      ...overrides,
    };

    const p = new URLSearchParams();
    p.set("page", current.page);
    p.set("rows", current.rows);
    p.set("sort", current.sort);
    p.set("order", current.order);

    const so = overrides.searchObj ?? searchObj;
    if (so.name?.trim()) p.set("name", so.name.trim());
    if (so.createdAt)
      p.set("createdAt", dayjs(so.createdAt).format("YYYY-MM-DD"));
    if (so.module) p.set("module", so.module);
    if (so.operation) p.set("operation", so.operation);
    if (so.isActive !== "") p.set("isActive", so.isActive);

    if (fetchTotalParam) p.set("fetchTotal", "true");
    return `?${p.toString()}`;
  };

  const fetchRoles = async (fetchTotalParam = true, overrides = {}) => {
    setLoading(true);
    try {
      const url = `http://localhost:3000/roles${buildQuery(
        fetchTotalParam,
        overrides
      )}`;
      const res = await axios.get(url, { withCredentials: true });
      const data = res?.data?.data || [];
      setRoles(data);
      if (res?.data?.total !== undefined) setCount(res.data.total);
      else if (fetchTotalParam) setCount(data.length);
    } catch (e) {
      console.error("Fetch roles error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(true);
  }, []);

  const handleSearch = () => {
    setPage(0);
    fetchRoles(true, { page: 0 });
  };

  const handleClearAll = () => {
    const initial = {
      page: 0,
      rows: 10,
      sort: "createdAt",
      order: "desc",
      searchObj: {
        name: "",
        createdAt: null,
        module: "",
        operation: "",
        isActive: "",
      },
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
    let nextSort = field;
    let nextOrder = "asc";
    if (sort === field) {
      nextOrder = order === "asc" ? "desc" : "asc";
    } else {
      nextOrder = field === "createdAt" ? "desc" : "asc";
    }
    setSort(nextSort);
    setOrder(nextOrder);
    setPage(0);
    fetchRoles(true, { sort: nextSort, order: nextOrder, page: 0 });
  };

  const allowedOps = useMemo(() => OPERATIONS, [searchObj.module]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          position: "sticky",
          top: 2,
          zIndex: 2,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 2,
          pt: 1,
          pb: 1,
          boxSizing: "border-box",
        }}
      >
        <PageHeader title="Roles" />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            overflowX: "auto",
            whiteSpace: "nowrap",
            mt: 1,
            "& .MuiFormControl-root, & .MuiTextField-root": { minWidth: 180 },
            "& .MuiInputBase-root": { height: 40, fontSize: "0.92rem" },
            "& .MuiInputLabel-root": { fontSize: "0.85rem" },
            "& .MuiFormHelperText-root": { minHeight: 18, mt: 0.5 },
          }}
        >
          <TextField
            name="name"
            label="Role name"
            variant="outlined"
            size="small"
            value={searchObj.name}
            onChange={(e) =>
              setSearchObj((s) => ({ ...s, name: e.target.value }))
            }
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            sx={{ minWidth: 300, marginTop: "13px", alignSelf: "center" }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Created on"
              value={searchObj.createdAt || null}
              onChange={(newVal) =>
                setSearchObj((s) => ({ ...s, createdAt: newVal }))
              }
              slotProps={{
                textField: {
                  size: "small",
                  sx: { "& .MuiInputBase-root": { height: 40 } },
                },
              }}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Module</InputLabel>
            <Select
              label="Module"
              value={searchObj.module}
              onChange={(e) =>
                setSearchObj((s) => ({
                  ...s,
                  module: e.target.value,
                  operation: "",
                }))
              }
            >
              <MenuItem value="">Any</MenuItem>
              {MODULES.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Operation</InputLabel>
            <Select
              label="Operation"
              value={searchObj.operation}
              onChange={(e) =>
                setSearchObj((s) => ({ ...s, operation: e.target.value }))
              }
            >
              <MenuItem value="">Any</MenuItem>
              {allowedOps.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
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

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setPage(0);
                fetchRoles(true, { page: 0, searchObj });
              }}
              endIcon={<SearchIcon />}
              sx={{ px: 2.5 }}
            >
              Search
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={handleClearAll}
              sx={{
                px: 2,
                textTransform: "none",
                borderColor: "#bdbdbd",
                color: "#424242",
                "&:hover": {
                  borderColor: "#9e9e9e",
                  backgroundColor: "rgba(0,0,0,0.02)",
                },
              }}
            >
              Clear
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/roles/add")}
              sx={{ px: 2.5 }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: 2,
          pt: 2,
          pb: 2,
          mt: 1,
          margin: "auto",
          width: "95%",
        }}
      >
        <RolesTable
          roles={roles}
          page={page}
          rowsPerPage={rowsPerPage}
          pageSetter={(newPage) => handleChangePage(newPage)}
          rowsPerPageSetter={(r) => handleChangeRowsPerPage(r)}
          length={count}
          loading={loading}
          sort={sort}
          order={order}
          onSort={handleSort}
        />
      </Box>

      <Box
        sx={{
          mt: 1.5,
          textAlign: "center",
          py: 1.25,
          fontSize: "0.75rem",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        © {new Date().getFullYear()} ecom
      </Box>
    </Box>
  );
};

export default Roles;
