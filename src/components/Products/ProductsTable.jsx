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
  Avatar,
  Typography,
  TableSortLabel,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { userContext } from "../../context/userContext";
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
  onToggle, // <<< used for confirmation popup in parent
}) => {
  const noData = products.length === 0 && !loading;
  const { user } = useContext(userContext);

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
          <Table
            stickyHeader
            size="small"
            sx={{ "& th, & td": { fontSize: "0.92rem", py: 1 } }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={headerCellSx}>
                  Image
                </TableCell>
                {sortableHeader("name", "Name")}
                {sortableHeader("description", "Description")}
                {sortableHeader("category", "Category")}
                {sortableHeader("price", "Price (₹)")}
                <TableCell align="center" sx={headerCellSx}>
                  Status
                </TableCell>
                {sortableHeader("createdAt", "Created At")}
                {!(
                  user?.permissions["products"].includes("read") &&
                  user?.permissions["products"].length == 1
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
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => {
                  const id = p._id || p.id;
                  const checked = !!p.status;
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
                      <TableCell align="center">
                        {p.description || "-"}
                      </TableCell>
                      <TableCell align="center">{p.category || "-"}</TableCell>
                      <TableCell align="center">{p.price ?? "-"}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Switch
                            size="small"
                            checked={checked}
                            onChange={() => onToggle && onToggle(id, !checked)} // <<< ask parent to confirm
                            disabled={loading}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "grey.500",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                { backgroundColor: "grey.500" },
                            }}
                            inputProps={{
                              "aria-label": "toggle product status",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      {!(
                        user?.permissions["products"].includes("read") &&
                        user?.permissions["products"].length == 1
                      ) ? (
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            {user?.permissions["products"].includes("write") ? (
                              <IconButton
                                color="primary"
                                onClick={() => onEdit && onEdit(id)}
                              >
                                <EditIcon />
                              </IconButton>
                            ) : null}
                            {user?.permissions["products"].includes(
                              "delete"
                            ) ? (
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
            count={noData ? 0 : length}
            rowsPerPage={rowsPerPage || 5}
            page={noData ? 0 : page}
            onPageChange={(_, np) => pageSetter(np)}
            onRowsPerPageChange={(e) =>
              rowsPerPageSetter(parseInt(e.target.value, 10))
            }
            labelRowsPerPage=""
          />
        </Box>
      </Paper>
    </>
  );
};

export default ProductsTable;
