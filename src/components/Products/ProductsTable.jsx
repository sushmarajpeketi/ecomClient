import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Box,
  Avatar,
  Typography,
  TableSortLabel,
  Snackbar,
  Alert,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const ProductsTable = ({
  products = [],
  page,
  rowsPerPage,
  pageSetter,
  rowsPerPageSetter,
  length,
  onEdit,
  onDelete,
  loading,
  sort,
  order,
  onSort,
}) => {
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [pendingId, setPendingId] = useState(null);
  const [optimistic, setOptimistic] = useState({});

  const openToast = (message, severity = "success") => setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const noData = products.length === 0 && !loading;

  const handleEdit = (id) => {
    if (typeof onEdit === "function") onEdit(id);
    else openToast("Edit action not available", "warning");
  };

  const handleDelete = (id) => {
    if (typeof onDelete === "function") onDelete(id);
    else openToast("Delete action not available", "warning");
  };

  const toggleStatus = async (prod) => {
    const id = prod._id || prod.id;
    const current = optimistic[id] ?? !!prod.status;
    const next = !current;
    setOptimistic((m) => ({ ...m, [id]: next }));
    try {
      setPendingId(id);
      await axios.put(`${BASE_URL}/products/${id}`, { status: next }, { withCredentials: true });
      openToast(`Product ${next ? "activated" : "deactivated"}`, "success");
    } catch (e) {
      setOptimistic((m) => ({ ...m, [id]: current }));
      openToast(e?.response?.data?.error || e?.response?.data?.message || "Failed to update status", "error");
    } finally {
      setPendingId(null);
    }
  };

  const headerCellSx = {
    fontWeight: 700,
    color: "#fff",
    backgroundColor: "#1f2937",
    "& .MuiTableSortLabel-root": { color: "#fff !important" },
    "& .MuiTableSortLabel-root:hover": { color: "#fff !important" },
    "& .MuiTableSortLabel-root.Mui-active": { color: "#fff !important" },
    "& .MuiTableSortLabel-icon": { color: "#fff !important", opacity: 1 },
    "& .MuiTableSortLabel-iconDirectionAsc": { color: "#fff !important" },
    "& .MuiTableSortLabel-iconDirectionDesc": { color: "#fff !important" },
  };

  const sortableHeader = (field, label) => (
    <TableCell align="center" sx={headerCellSx}>
      <TableSortLabel
        active={sort === field}
        direction={sort === field ? order : "asc"}
        onClick={() => onSort && onSort(field)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small" sx={{ "& th, & td": { fontSize: "0.92rem", py: 1 } }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={headerCellSx}>Image</TableCell>
                {sortableHeader("name", "Name")}
                {sortableHeader("description", "Description")}
                {sortableHeader("category", "Category")}
                {sortableHeader("price", "Price (₹)")}
                <TableCell align="center" sx={headerCellSx}>Status</TableCell>
                {sortableHeader("createdAt", "Created At")}
                <TableCell align="center" sx={headerCellSx}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {noData ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => {
                  const id = p._id || p.id;
                  const disabled = pendingId === id;
                  const checked = optimistic[id] ?? !!p.status;
                  return (
                    <TableRow key={id} hover>
                      <TableCell align="center">
                        <Avatar
                          variant="rounded"
                          src={p.image}
                          alt={p.name}
                          sx={{ width: 56, height: 56, margin: "auto" }}
                        />
                      </TableCell>
                      <TableCell align="center">{p.name}</TableCell>
                      <TableCell align="center">{p.description || "-"}</TableCell>
                      <TableCell align="center">{p.category || "-"}</TableCell>
                      <TableCell align="center">{p.price ?? "-"}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Switch
                            size="small"
                            checked={checked}
                            onChange={() => toggleStatus(p)}
                            disabled={disabled}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "grey.500" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "grey.500" },
                            }}
                            inputProps={{ "aria-label": "toggle product status" }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <IconButton color="primary" onClick={() => handleEdit(id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, 100]}
            count={noData ? 0 : length}
            rowsPerPage={rowsPerPage || 5}
            page={noData ? 0 : page}
            onPageChange={(_, np) => pageSetter(np)}
            onRowsPerPageChange={(e) => rowsPerPageSetter(parseInt(e.target.value, 10))}
            labelRowsPerPage=""
          />
        </Box>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductsTable;
