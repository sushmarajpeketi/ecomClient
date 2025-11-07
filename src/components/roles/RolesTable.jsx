// src/components/roles/RolesTable.jsx
import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  TableSortLabel,
  Switch,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";

const RolesTable = ({
  roles = [],
  page,
  rowsPerPage,
  pageSetter,
  rowsPerPageSetter,
  length,
  loading,
  sort,
  order,
  onSort,
}) => {
  const navigate = useNavigate();
  const noData = roles.length === 0 && !loading;

  const headerCellSx = {
    fontWeight: 700,
    backgroundColor: "rgba(0,0,0,0.04)",
    backdropFilter: "saturate(100%)",
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader size="small" sx={{ "& td, & th": { fontSize: "0.88rem" } }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={headerCellSx}>
                <TableSortLabel
                  active={sort === "name"}
                  direction={sort === "name" ? (order === "asc" ? "asc" : "desc") : "asc"}
                  onClick={() => onSort?.("name")}
                >
                  Role Name
                </TableSortLabel>
              </TableCell>

              <TableCell align="center" sx={headerCellSx}>Description</TableCell>

              <TableCell align="center" sx={headerCellSx}>Status</TableCell>

              <TableCell align="center" sx={headerCellSx}>
                <TableSortLabel
                  active={sort === "createdAt"}
                  direction={sort === "createdAt" ? (order === "asc" ? "asc" : "desc") : "desc"}
                  onClick={() => onSort?.("createdAt")}
                >
                  Created On
                </TableSortLabel>
              </TableCell>

            
              <TableCell align="right" sx={{ ...headerCellSx, width: 120 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {noData ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">No roles found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((r) => {
                const id = r.id || r._id; 
                return (
                  <TableRow key={id} hover>
                    <TableCell align="center">{r.name}</TableCell>
                    <TableCell align="center">{r.description?.trim() || "-"}</TableCell>

                    
                    <TableCell align="center">
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <Switch size="small" checked={!!r.isActive} disabled inputProps={{ "aria-readonly": true }} />
                      </Stack>
                    </TableCell>

                    <TableCell align="center">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                    </TableCell>

                  
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="View">
                        <span>
                          <IconButton
                            size="small"
                            aria-label="view role"
                            onClick={() => navigate(`/roles/view/${id}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <span>
                          <IconButton
                            size="small"
                            aria-label="edit role"
                            onClick={() => navigate(`/roles/edit/${id}`)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
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
          rowsPerPage={rowsPerPage || 10}
          page={noData ? 0 : page}
          onPageChange={(e, newPage) => pageSetter(newPage)}
          onRowsPerPageChange={(e) => rowsPerPageSetter(parseInt(e.target.value, 10))}
          labelRowsPerPage=""
        />
      </Box>
    </Paper>
  );
};

export default RolesTable;
