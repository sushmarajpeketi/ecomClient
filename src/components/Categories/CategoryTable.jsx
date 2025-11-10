// src/components/CategoryTable.jsx
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
  Typography,
  Box,
  Snackbar,
  Alert,
  Switch,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const CategoryTable = ({
  categories = [],
  page,
  rowsPerPage,
  pageSetter,
  rowsPerPageSetter,
  length = 0,
  onEdit,
  onDelete,
  loading = false,
  onStatusUpdated,
  sort,
  order,
  onSort,
}) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pendingId, setPendingId] = useState(null);
  const [optimistic, setOptimistic] = useState({});
  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const noData = categories.length === 0 && !loading;

  const handleEdit = (id, cat) => {
    if (typeof onEdit === "function") onEdit(id, cat);
    else openToast("Edit action not available", "warning");
  };

  const handleDelete = (id) => {
    if (typeof onDelete === "function") onDelete(id);
    else openToast("Delete action not available", "warning");
  };

  const toggleStatus = async (cat) => {
    const id = cat._id || cat.id;
    const current = optimistic[id] ?? !!cat.status;
    const next = !current;
    setOptimistic((m) => ({ ...m, [id]: next }));
    try {
      setPendingId(id);
      await axios.put(
        `${BASE_URL}/category/${id}`,
        { status: next },
        { withCredentials: true }
      );
      onStatusUpdated?.(id, next);
      openToast(`Category ${next ? "activated" : "deactivated"}`, "success");
    } catch (e) {
      setOptimistic((m) => ({ ...m, [id]: current }));
      openToast(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          "Failed to update status",
        "error"
      );
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
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table
            stickyHeader
            size="small"
            sx={{ "& th, & td": { fontSize: "0.92rem", py: 1 } }}
          >
            <TableHead>
              <TableRow>
                {sortableHeader("name", "Name")}
                {sortableHeader("description", "Description")}
                <TableCell align="center" sx={headerCellSx}>
                  Status
                </TableCell>
                <TableCell align="center" sx={headerCellSx}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {noData ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No categories found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => {
                  const id = cat._id || cat.id;
                  const disabled = pendingId === id;
                  const checked = optimistic[id] ?? !!cat.status;
                  return (
                    <TableRow key={id} hover>
                      <TableCell align="center">{cat.name}</TableCell>
                      <TableCell align="center">
                        {cat.description || "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Switch
                            size="small"
                            checked={checked}
                            onChange={() => toggleStatus(cat)}
                            disabled={disabled}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "grey.800",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                { backgroundColor: "grey.800" },
                            }}
                            inputProps={{
                              "aria-label": "toggle category status",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(id, cat)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(id)}
                          >
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
            count={length} // ← always use total
            rowsPerPage={rowsPerPage || 5}
            page={page} // ← pass current page; parent keeps it valid
            onPageChange={(_, newPage) => pageSetter(newPage)}
            onRowsPerPageChange={(e) =>
              rowsPerPageSetter(parseInt(e.target.value, 10))
            }
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
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategoryTable;
