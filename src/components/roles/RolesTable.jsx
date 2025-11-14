// src/components/roles/RolesTable.jsx
import React, { useContext } from "react";
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
  Typography,
  TableSortLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { userContext } from "../../context/userContext";

const headerSx = {
  fontWeight: 700,
  color: "#fff",
  backgroundColor: "#1f2937",
  "& .MuiTableSortLabel-root": { color: "#fff !important" },
  "& .MuiTableSortLabel-root:hover": { color: "#fff !important" },
  "& .MuiTableSortLabel-root.Mui-active": { color: "#fff !important" },
  "& .MuiTableSortLabel-icon": { color: "#fff !important", opacity: 1 },
};

const RolesTable = ({
  roles = [],
  page,
  rowsPerPage,
  pageSetter,
  rowsPerPageSetter,
  length = 0,
  loading = false,
  sort,
  order,
  onSort,
  onToggle,
  onView,
  onEdit,
}) => {
  const noData = roles.length === 0 && !loading;
  const { user } = useContext(userContext);
  const sortableHeader = (field, label) => (
    <TableCell align="center" sx={headerSx}>
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
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
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
              {sortableHeader("createdAt", "Created At")}
              <TableCell align="center" sx={headerSx}>
                Status
              </TableCell>

              {!(
                user?.permissions["roles"].includes("read") &&
                user?.permissions["roles"].length == 1
              ) ? (
                <TableCell align="center" sx={headerSx}>
                  Actions
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>

          <TableBody>
            {noData ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No roles found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((r) => {
                const id = r._id || r.id;
                const checked = !!r.isActive;
                return (
                  <TableRow key={id} hover>
                    <TableCell align="center">{r.name}</TableCell>
                    <TableCell align="center">{r.description || "-"}</TableCell>
                    <TableCell align="center">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Switch
                          size="small"
                          checked={checked}
                          onChange={() => onToggle && onToggle(id, !checked)}
                          disabled={loading}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "grey.800",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              { backgroundColor: "grey.800" },
                          }}
                          inputProps={{ "aria-label": "toggle role status" }}
                        />
                      </Box>
                    </TableCell>

                    {!(
                      user?.permissions["roles"].includes("read") &&
                      user?.permissions["roles"].length == 1
                    ) ? (
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {user?.permissions["roles"].includes("write") ? (
                            <>
                              <Tooltip title="View">
                                <IconButton
                                  color="primary"
                                  onClick={() => onView && onView(id)}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  color="primary"
                                  onClick={() => onEdit && onEdit(id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : null}
                        </Box>
                      </TableCell>
                    ) : null}
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
          rowsPerPage={rowsPerPage || 10}
          page={noData ? 0 : page}
          onPageChange={(_, np) => pageSetter(np)}
          onRowsPerPageChange={(e) =>
            rowsPerPageSetter(parseInt(e.target.value, 10))
          }
          labelRowsPerPage=""
        />
      </Box>
    </Paper>
  );
};

export default RolesTable;
