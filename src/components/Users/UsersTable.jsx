import React from "react";
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

const columns = [
  { id: "username", label: "User Name", minWidth: "100px" },
  { id: "email", label: "Email", minWidth: "100px" },
  {
    id: "mobile",
    label: "Mobile",
    minWidth: "100px",
    // align: "right",
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: "100px",
  },
];

export default function UsersTable({
  users,
  page,
  rowsPerPage,
  rowsPerPageSetter,
  pageSetter,
  length,
}) {
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  let rows = users.map((el) => {
    return { username: el.username, email: el.email, mobile: el.mobile };
  });

  const handleChangePage = (event, newPage) => {
    pageSetter(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    rowsPerPageSetter(event.target.value);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 2,
    p: 4,
  };

  return (
    <Paper
      sx={{
        // width: "clamp(400px, 80%, 900px)",
        margin: 5,
        mx: "auto",
        // overflow: "hidden",
        // height: "500px",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 600,
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    boxSizing: "border-box",
                    textAlign: "center",
                    width: 120,
                    whiteSpace: "nowrap",
                    backgroundColor: "lightgray",
                    // overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.code}
                  sx={{
                    maxWidth: 100,
                    overflow: "auto",
                    height: "auto",
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];

                    return column.id == "actions" ? (
                      <TableCell key={column.id} align={column.align}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "50%",
                            margin: "auto",
                          }}
                        >
                          <IconButton color="primary" onClick={handleOpenEdit}>
                            <EditDocumentIcon />
                          </IconButton>
                          <IconButton color="error" onClick={handleOpenDelete}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    ) : (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ textAlign: "center" }}
                      >
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100, 1000]}
        component="div"
        count={length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div>
        <Modal
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Do you want to delete the user?
            </Typography>
            <Button>Yes</Button>
            <Button type="error">No</Button>
          </Box>
        </Modal>
      </div>
      <div>
        <Modal
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Do you want to delete the user?
            </Typography>
            <Button>Yes</Button>
            <Button type="error">No</Button>
          </Box>
        </Modal>
      </div>
    </Paper>
  );
}
