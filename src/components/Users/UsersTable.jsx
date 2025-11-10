import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  Paper,
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";

const UsersTable = ({
  users = [],
  page,
  rowsPerPage,
  rowsPerPageSetter,
  pageSetter,
  length,
  onDelete, // optional: parent refresh hook
}) => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("username");
  const [order, setOrder] = useState("asc");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    loading: false,
  });

  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const rows = useMemo(
    () =>
      users.map((el) => {
        const roleText =
          (el?.role && typeof el.role === "object" && (el.role.name || el.role.title)) ||
          el?.roleName ||
          (typeof el?.role === "string" ? el.role : "") ||
          "-";

        return {
          username: el.username,
          email: el.email,
          mobile: el.mobile,
          role: roleText,
          id: el._id || el.id,
        };
      }),
    [users]
  );

  const sortedRows = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const A = (a[sort] || "").toString().toLowerCase();
      const B = (b[sort] || "").toString().toLowerCase();
      if (A < B) return order === "asc" ? -1 : 1;
      if (A > B) return order === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sort, order]);

  const handleSort = (field) => {
    if (sort === field) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSort(field);
      setOrder("asc");
    }
  };

  const handleChangePage = (_, newPage) => pageSetter(newPage);
  const handleChangeRowsPerPage = (event) =>
    rowsPerPageSetter(parseInt(event.target.value, 10));

  const columns = [
    { id: "username", label: "User Name", sortable: true },
    { id: "email", label: "Email", sortable: true },
    { id: "mobile", label: "Mobile", sortable: true },
    { id: "role", label: "Role", sortable: true },
    { id: "actions", label: "Actions", sortable: false },
  ];

  const headerCellSx = {
    fontWeight: 700,
    color: "#fff",
    backgroundColor: "#1f2937",
    "& .MuiTableSortLabel-root": { color: "#fff !important" },
    "& .MuiTableSortLabel-root:hover": { color: "#fff !important" },
    "& .MuiTableSortLabel-icon": { color: "#fff !important", opacity: "1 !important" },
    "& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": {
      color: "#fff !important",
      opacity: "1 !important",
    },
  };

  const noData = sortedRows.length === 0;

  const askDelete = (id) => {
    setConfirm({ open: true, id, loading: false });
  };

  const handleDeleteConfirm = async () => {
    if (!confirm.id) return;
    setConfirm((c) => ({ ...c, loading: true }));

    try {
      if (typeof onDelete === "function") {
        // Let parent decide how to refresh after soft delete
        await onDelete(confirm.id);
      } else {
        // Built-in soft delete call (sets isDeleted: true on server)
        await axios.delete(`http://localhost:3000/users/${confirm.id}`, {
          withCredentials: true,
        });
      }
      openToast("User marked as deleted.", "success");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to delete user";
      openToast(msg, "error");
    } finally {
      setConfirm({ open: false, id: null, loading: false });
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small" sx={{ "& td, & th": { fontSize: "0.88rem" } }}>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} align="center" sx={headerCellSx}>
                    {col.sortable ? (
                      <TableSortLabel
                        active={sort === col.id}
                        direction={sort === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                        sx={{
                          color: "#fff !important",
                          "& .MuiTableSortLabel-icon": { color: "#fff !important", opacity: "1 !important" },
                        }}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {noData ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows.map((row) => (
                  <TableRow key={row.id} hover>
                    {columns.map((col) =>
                      col.id === "actions" ? (
                        <TableCell key={col.id} align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/users/edit/${row.id}`)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => askDelete(row.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      ) : (
                        <TableCell key={col.id} align="center">
                          {row[col.id]}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, 100]}
            count={length}
            rowsPerPage={rowsPerPage || 10}
            page={page}
            onPageChange={(_, newPage) => pageSetter(newPage)}
            onRowsPerPageChange={(e) => rowsPerPageSetter(parseInt(e.target.value, 10))}
            labelRowsPerPage=""
          />
        </Box>
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirm.open}
        onClose={() => !confirm.loading && setConfirm({ open: false, id: null, loading: false })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          This will <strong>mark the user as deleted</strong>. They won’t appear in the list anymore.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirm({ open: false, id: null, loading: false })}
            disabled={confirm.loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={confirm.loading}
          >
            {confirm.loading ? "Deleting..." : "Mark as Deleted"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default UsersTable;
