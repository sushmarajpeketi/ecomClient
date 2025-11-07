import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TablePagination,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CategoryTable = ({
  categories,
  page,
  rowsPerPage,
  pageSetter,
  rowsPerPageSetter,
  length,
  onEdit,
  onDelete,
}) => {
  const noData = categories.length === 0;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {noData ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description || "-"}</TableCell>
                  <TableCell>{cat.status ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEdit(cat._id, cat)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton onClick={() => onDelete(cat._id)}>
                      <DeleteIcon />
                    </IconButton>
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
               count={length}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={(e, newPage) => pageSetter(newPage)}
               onRowsPerPageChange={(e) =>
                 rowsPerPageSetter(parseInt(e.target.value, 10))
               }
               labelRowsPerPage=""
             />
           </Box>
    </Paper>
  );
};

export default CategoryTable;
