// src/components/modules/ModulesTable.jsx
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
  Typography,
  Box,
  Switch,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { userContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
const ModulesTable = ({
  modules = [],
  page,
  rowsPerPage,
  pageSetter,
  rowsPerPageSetter,
  length = 0,
  onEdit,
  onDelete,
  onToggle,
  loading = false,
  sort,
  order,
  onSort,
}) => {
  const noData = modules.length === 0 && !loading;
  const { user } = useContext(userContext);

  const navigate = useNavigate();
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
              {sortableHeader("createdAt", "CreatedAt")}

              <TableCell align="center" sx={headerCellSx}>
                Status
              </TableCell>
              {!(
                user?.permissions["modules"].includes("read") &&
                user?.permissions["modules"].length == 1
              ) ? (
                <TableCell align="center" sx={headerCellSx}>
                  Actions
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>

          <TableBody>
            {noData ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No modules found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              modules.map((module) => {
                const id = module._id || module.id;
                const checked = !!module.status;
                return (
                  <TableRow key={id} hover>
                    <TableCell align="center">{module.name}</TableCell>
                    <TableCell align="center">
                      {module.description || "-"}
                    </TableCell>
                    <TableCell align="center">
                      {module.createdAt
                        ? new Date(module.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Switch
                          size="small"
                          checked={checked}
                          onChange={() => onToggle && onToggle(id, !checked)}
                          disabled={
                            loading &&
                            user?.permissions["modules"].includes("read") &&
                            user?.permissions["modules"].length == 1
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "grey.800",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              { backgroundColor: "grey.800" },
                          }}
                          inputProps={{
                            "aria-label": "toggle module status",
                          }}
                        />
                      </Box>
                    </TableCell>
                    {!(
                      user?.permissions["modules"].includes("read") &&
                      user?.permissions["modules"].length == 1
                    ) ? (
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {user?.permissions["modules"].includes("read") ? (
                            <IconButton
                              color="primary"
                              onClick={() => onEdit && onEdit(id, module)}
                            >
                              <EditIcon />
                            </IconButton>
                          ) : null}

                          {user?.permissions["modules"].includes("delete") ? (
                            <IconButton
                              color="error"
                              onClick={() => onDelete && onDelete(id)}
                            >
                              <DeleteIcon />
                            </IconButton>
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
          count={length}
          rowsPerPage={rowsPerPage || 5}
          page={page}
          onPageChange={(_, newPage) => pageSetter(newPage)}
          onRowsPerPageChange={(e) =>
            rowsPerPageSetter(parseInt(e.target.value, 10))
          }
          labelRowsPerPage=""
        />
      </Box>
    </Paper>
  );
};

export default ModulesTable;
