import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Paper,
  TablePagination
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
            {categories.map((cat) => (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => pageSetter(newPage)}
        onRowsPerPageChange={(e) => rowsPerPageSetter(parseInt(e.target.value))}
      />
    </Paper>
  );
};

export default CategoryTable;
