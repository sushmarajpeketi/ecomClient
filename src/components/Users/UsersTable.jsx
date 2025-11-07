import React, { useState } from "react";
import { Paper, Box, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditUser from "./EditUser";
import { useNavigate } from "react-router-dom";
const columns = [
  { id: "username", label: "User Name" },
  { id: "email", label: "Email" },
  { id: "mobile", label: "Mobile" },
  { id: "actions", label: "Actions" },
];

export default function UsersTable({
  users,
  page,
  rowsPerPage,
  rowsPerPageSetter,
  pageSetter,
  length,
  onEdit,
}) {
  const [openDelete, setOpenDelete] = useState(false);
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [openEdit, setOpenEdit] = useState(false);

  const navigate = useNavigate();

  const rows = users.map((el) => ({
    username: el.username,
    email: el.email,
    mobile: el.mobile,
    id: el._id || el.id, // ✅ FIX: convert _id → id
  }));

  const handleChangePage = (event, newPage) => {
    pageSetter(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    rowsPerPageSetter(parseInt(event.target.value, 10));
  };

  const handleSaveEdit = (id, updatedData) => {
    onEdit(id, updatedData);
    setOpenEdit(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 2,
    p: 4,
  };

  return (
    <Paper sx={{ margin: 5, mx: "auto" }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    textAlign: "center",
                    backgroundColor: "lightgray",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((column) =>
                  column.id === "actions" ? (
                    <TableCell key={column.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/users/edit/${row.id}`)}
                        >
                          <EditDocumentIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => setOpenDelete(true)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  ) : (
                    <TableCell key={column.id} style={{ textAlign: "center" }}>
                      {row[column.id]}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
      component="div"
        rowsPerPageOptions={[5, 10, 25, 100]}
        count={length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    
    </Paper>
  );
}
