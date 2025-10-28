import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import UsersTable from "./UsersTable";
import { Box, Stack, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const Users = () => {
  let [length, setLength] = React.useState(0);
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
    fetchUsers();
  }, [page, rowsPerPage]);

  async function fetchUsers() {
    try {
      console.log("hitting dynamic users ", page, rowsPerPage);
      const count = await axios(`http://localhost:3000/users/length`, {
        withCredentials: true,
      });
      setLength(count.data);
      console.log("length in users", length);
      const res = await axios.get(
        `http://localhost:3000/users?page=${page}&rows=${rowsPerPage}`,
        { withCredentials: true }
      );
      console.log("response is ", res.data);
      setUser(res.data);
      console.log("users inside users", users);
    } catch (e) {
      console.log("error is", e);
      toast.error(e.message);
    }
  }

  return (
    <Box
      sx={{
        padding : 5,
        width: "100%",
        boxSizing: "border-box",
        maxHeight: "calc(100% - 90px)",
      }}
    >
      <Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              id="filled-search"
              label="Search by username"
              type="search"
              variant="outlined"
            />
            <TextField
              id="filled-search"
              label="Search by email"
              type="search"
              // variant="filled"
            />
            <TextField
              id="filled-search"
              label="Search by number"
              type="search"
              // variant="filled"
            />
          </Box>
          <Stack
            spacing={2}
            direction="row"
            sx={{ width: "50%" }}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              variant="outlined"
              endIcon={<SearchIcon />}
              loading:false
              loadingPosition="start"
            >
              Search
            </Button>
            <Button variant="contained" endIcon={<AddIcon />}>
              Add
            </Button>
          </Stack>
        </Box>

        <UsersTable
          users={users}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageSetter={rowsPerPageSetter}
          pageSetter={pageSetter}
          length={length}
        />

        <Box sx={{width:"100%", height:"50px" ,color:"gray",textAlign:"center" }}>@all copy rights reserved</Box>
      </Box>
      
    </Box>
  );
};

export default Users;
