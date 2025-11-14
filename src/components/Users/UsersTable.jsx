import React, { useEffect, useMemo, useState } from "react";
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
  Switch,
  Tooltip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

const UsersTable = ({
  user,
  users = [],
  page,
  rowsPerPage,
  rowsPerPageSetter,
  pageSetter,
  length,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("username");
  const [order, setOrder] = useState("asc");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    id: null,
    loading: false,
  });

  // NEW: confirmation for status toggle
  const [confirmToggle, setConfirmToggle] = useState({
    open: false,
    id: null,
    nextVal: null,
    loading: false,
  });

  // local status + pending maps for smooth toggles
  const [localStatus, setLocalStatus] = useState({});
  const [pending, setPending] = useState({});

  useEffect(() => {
    const map = {};
    users.forEach((u) => {
      const id = u._id || u.id;
      map[id] = typeof u.status === "boolean" ? u.status : true;
    });
    setLocalStatus(map);
  }, [users]);

  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const rows = useMemo(
    () =>
      users.map((el) => {
        const roleText =
          (el?.role &&
            typeof el.role === "object" &&
            (el.role.name || el.role.title)) ||
          el?.roleName ||
          (typeof el?.role === "string" ? el.role : "") ||
          "-";

        return {
          username: el.username,
          email: el.email,
          mobile: el.mobile,
          role: roleText,
          status: typeof el.status === "boolean" ? el.status : true,
          id: el._id || el.id,
          createdAt: el.createdAt,
        };
      }),
    [users]
  );

  const sortedRows = useMemo(() => {
    const arr = [...rows];
    arr?.sort((a, b) => {
      const A = (a[sort] ?? "").toString().toLowerCase();
      const B = (b[sort] ?? "").toString().toLowerCase();
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

   let actions = (user?.permissions["users"].includes("read") &&
                  user?.permissions["users"].length == 1)? undefined:{ id: "actions", label: "Actions", sortable: false }
  const columns = [
    { id: "username", label: "User Name", sortable: true },
    { id: "email", label: "Email", sortable: true },
    { id: "mobile", label: "Mobile", sortable: true },
    { id: "createdAt", label: "CreatedAt", sortable: true },
    { id: "role", label: "Role", sortable: true },
    { id: "status", label: "Status", sortable: false },
    
  ];

  if(actions){
    columns.push(actions)
  }
  const headerCellSx = {
    fontWeight: 700,
    color: "#fff",
    backgroundColor: "#1f2937",
    "& .MuiTableSortLabel-root": { color: "#fff !important" },
    "& .MuiTableSortLabel-root:hover": { color: "#fff !important" },
    "& .MuiTableSortLabel-icon": {
      color: "#fff !important",
      opacity: "1 !important",
    },
    "& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": {
      color: "#fff !important",
      opacity: "1 !important",
    },
  };

  const askDelete = (id) =>
    setConfirmDelete({ open: true, id, loading: false });

  // API call (kept same) — now only called after confirmation
  const toggleStatus = async (id, nextVal) => {
    setPending((p) => ({ ...p, [id]: true }));
    setLocalStatus((s) => ({ ...s, [id]: nextVal })); 

    try {
      await axios.put(
        `${API_BASE}/users/${id}`,
        { status: nextVal },
        { withCredentials: true }
      );
      openToast(`User ${nextVal ? "activated" : "deactivated"}.`, "success");
    } catch (e) {
      // revert on failure
      setLocalStatus((s) => ({ ...s, [id]: !nextVal }));
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to update status";
      openToast(msg, "error");
    } finally {
      setPending((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table
            stickyHeader
            size="small"
            sx={{ "& td, & th": { fontSize: "0.88rem" } }}
          >
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} align="center" sx={headerCellSx}>
                    {col?.sortable ? (
                      <TableSortLabel
                        active={sort === col.id}
                        direction={sort === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                        sx={{
                          color: "#fff !important",
                          "& .MuiTableSortLabel-icon": {
                            color: "#fff !important",
                            opacity: "1 !important",
                          },
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
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows.map((row) => {
                  const checked = (localStatus[row.id] ?? row.status) === true;

                  return (
                    <TableRow key={row.id} hover>
                      {columns.map((col) => {
                       
                        if (col.id === "actions" && !(user?.permissions["users"].includes("read") &&
                  user?.permissions["users"].length == 1)) {
                          return (
                            <TableCell key={col.id} align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 1,
                                }}
                              >
                                 {user?.permissions["users"].includes("write") ? (
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      navigate(`/users/edit/${row.id}`)
                                    }
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                ) : null}


                                {user?.role === "superadmin" && user?.permissions["users"].includes("delete") ? (
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => askDelete(row.id)}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                ) : null}
                              </Box>
                            </TableCell>
                          );
                        }

                        if (col.id === "status") {
                          return (
                            <TableCell key={col.id} align="center">
                              <Tooltip
                                title={checked ? "Active" : "Inactive"}
                                arrow
                              >
                                <span>
                                  <Switch
                                    checked={checked}
                                    onChange={(e) =>
                                      setConfirmToggle({
                                        open: true,
                                        id: row.id,
                                        nextVal: e.target.checked,
                                        loading: false,
                                      })
                                    }
                                    disabled={
                                      !!pending[row.id] || confirmToggle.open
                                    }
                                    sx={{
                                      "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: "grey.800",
                                      },
                                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                        {
                                          backgroundColor: "grey.800",
                                        },
                                    }}
                                  />
                                </span>
                              </Tooltip>
                            </TableCell>
                          );
                        }
                        if (col.id === "createdAt") {
                          return (
                            <TableCell align="center">
                              {row[col.id]
                                ? new Date(row.createdAt).toLocaleDateString()
                                : "-"}
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={col.id} align="center">
                            {row[col.id]}
                          </TableCell>
                        );
                      })}
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
            count={length}
            rowsPerPage={rowsPerPage || 10}
            page={page}
            onPageChange={(_, newPage) => pageSetter(newPage)}
            onRowsPerPageChange={(e) =>
              rowsPerPageSetter(parseInt(e.target.value, 10))
            }
            labelRowsPerPage=""
          />
        </Box>
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={() =>
          !confirmDelete.loading &&
          setConfirmDelete({ open: false, id: null, loading: false })
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          This will <strong>mark the user as deleted</strong>. They won’t appear
          in the list anymore.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDelete({ open: false, id: null, loading: false })
            }
            disabled={confirmDelete.loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              setConfirmDelete((c) => ({ ...c, loading: true }));
              try {
                if (typeof onDelete === "function")
                  await onDelete(confirmDelete.id);
                else
                  await axios.delete(`${API_BASE}/users/${confirmDelete.id}`, {
                    withCredentials: true,
                  });
                openToast("User marked as deleted.", "success");
              } catch (e) {
                const msg =
                  e?.response?.data?.message ||
                  e?.response?.data?.error ||
                  e?.message ||
                  "Failed to delete user";
                openToast(msg, "error");
              } finally {
                setConfirmDelete({ open: false, id: null, loading: false });
              }
            }}
            disabled={confirmDelete.loading}
          >
            {confirmDelete.loading ? "Deleting..." : "Mark as Deleted"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NEW: Confirm Toggle Dialog */}
      <Dialog
        open={confirmToggle.open}
        onClose={() =>
          !confirmToggle.loading &&
          setConfirmToggle({
            open: false,
            id: null,
            nextVal: null,
            loading: false,
          })
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {confirmToggle.nextVal === false
            ? "User is getting deactivated, are you sure?"
            : "User is getting activated, are you sure?"}
        </DialogTitle>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() =>
              setConfirmToggle({
                open: false,
                id: null,
                nextVal: null,
                loading: false,
              })
            }
            disabled={confirmToggle.loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              setConfirmToggle((c) => ({ ...c, loading: true }));
              try {
                await toggleStatus(confirmToggle.id, confirmToggle.nextVal);
              } finally {
                setConfirmToggle({
                  open: false,
                  id: null,
                  nextVal: null,
                  loading: false,
                });
              }
            }}
            disabled={confirmToggle.loading}
            sx={{
              bgcolor: "grey.800",
              color: "common.white",
              "&:hover": { bgcolor: "grey.900" },
            }}
          >
            {confirmToggle.loading ? "Updating..." : "Yes, proceed"}
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
    </>
  );
};

export default UsersTable;
