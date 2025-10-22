import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import UsersTable from "./UsersTable";
import { Box } from "@mui/material";
const Users = () => {
  let [length,setLength]=  React.useState(0)
  let [users, setUser] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const pageSetter = (newPage) => {
    setPage(newPage);
  };
  const rowsPerPageSetter = (val) => {
    setRowsPerPage(val);
    setPage(0);
  };

  useEffect(() => {
    console.log("---------------------page number", page)
    fetchUsers();
  }, [page, rowsPerPage]);

  async function fetchUsers() {
    try {
      console.log("hitting dynamic users ", page, rowsPerPage);
      const count = await axios(`http://localhost:3000/users/length`,{withCredentials:true})
      setLength(count.data)
      console.log("length is in users",length)
      const res = await axios.get(
        `http://localhost:3000/users/dynamic-users/${page}/${rowsPerPage}`,
        { withCredentials: true }
      );
      console.log("response is ",res.data);
      setUser( res.data);
      console.log("users inside users", users);
    } catch (e) {
      console.log("error is", e);
      toast.error(e.message);
    }
  }
  // fetchUsers()
  console.log("-------------", users);
  return (
    <Box>
      <Box sx={{width:"90%",minHeight:"90%"}}>
        <UsersTable
          users={users}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageSetter={rowsPerPageSetter}
          pageSetter={pageSetter}
          length={length}
        />
      </Box>
    </Box>
  );
};

export default Users;
