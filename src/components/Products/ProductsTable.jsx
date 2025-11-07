import React from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const noData = products.length === 0 && !loading;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small" sx={{ "& th, & td": { fontSize: "0.92rem", py: 1 } }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">
                <TableSortLabel active={sort === "name"} direction={sort === "name" ? order : "asc"} onClick={() => onSort("name")}>
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">
                <TableSortLabel active={sort === "price"} direction={sort === "price" ? order : "asc"} onClick={() => onSort("price")}>
                  Price (₹)
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel active={sort === "createdAt"} direction={sort === "createdAt" ? order : "asc"} onClick={() => onSort("createdAt")}>
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {noData ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p._id} hover>
                  <TableCell align="center">
                    <Avatar variant="rounded" src={p.image} alt={p.name} sx={{ width: 56, height: 56, margin: "auto" }} />
                  </TableCell>
                  <TableCell align="center">{p.name}</TableCell>
                  <TableCell align="center">{p.description || "-"}</TableCell>
                  <TableCell align="center">{p.category || "-"}</TableCell>
                  <TableCell align="center">{p.price ?? "-"}</TableCell>
                  <TableCell align="center">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <IconButton color="primary" onClick={() => onEdit(p._id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDelete(p._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
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
          count={noData ? 0 : length}
          rowsPerPage={rowsPerPage || 5}
          page={noData ? 0 : page}
          onPageChange={(_, np) => pageSetter(np)}
          onRowsPerPageChange={(e) => rowsPerPageSetter(parseInt(e.target.value, 10))}
          labelRowsPerPage=""
        />
      </Box>
    </Paper>
  );
};

export default ProductsTable;
