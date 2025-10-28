import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "username", label: "User Name", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  {
    id: "mobile",
    label: "Mobile",
    minWidth: 100,
    align: "right",
  },
];

export default function UsersTable({ users,page,rowsPerPage,rowsPerPageSetter,pageSetter,length }) {

  let rows = users.map((el) => {
    return { username: el.username, email: el.email, mobile: el.mobile };
  });

  const handleChangePage = (event, newPage) => {
    pageSetter(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    rowsPerPageSetter(event.target.value);
  };

  return (
    <Paper  sx={{
    // width: "clamp(400px, 80%, 900px)",
    margin:5,
    mx: "auto",
    // overflow: "hidden",
    height:"500px"
    
  }}>
      <TableContainer
       sx={{ 
        // height:"80%"
        // maxHeight: 600 
      }}
       >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code} sx={{maxWidth:100}} >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} >
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
        rowsPerPageOptions={[5,10, 25, 100,1000]}
        component="div"
        count={length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
     
    </Paper>
  );
}
