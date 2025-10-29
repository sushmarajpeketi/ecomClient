import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import UsersTable from "./UsersTable";
import { Box, Stack, TextField, Button, ratingClasses } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { userContext } from "../context/userContext";
import { relative } from "@cloudinary/url-gen/qualifiers/flag";

const Users = () => {
  const { user: globalUser } = useContext(userContext);
  let [length, setLength] = React.useState(0);
  let [users, setUser] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [searchObj, setSearchObj] = useState({});
  const [isChangeInFilter, setIsChangeInFilter] = useState(true);

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
      let queryString = ``;
      if (searchObj?.username) {
        queryString += `&username=${searchObj?.username}`;
      }
      if (searchObj?.email) {
        queryString += `&email=${searchObj?.email}`;
      }
      if (isChangeInFilter) {
        queryString += `&length=true`;
      }

      const res = await axios.get(
        `http://localhost:3000/users?page=${page}&rows=${rowsPerPage}` +
          queryString,
        { withCredentials: true }
      );
      
      setUser(res?.data?.users);
      if (res?.data?.count) {
        setLength(res?.data?.count);
        setIsChangeInFilter(false);
      }
      // if(count<0){
        
      // }
      // console.log("users inside users", users);
    } catch (e) {
      console.log("error is", e);
      toast.error(e.message);
    }
  }

  return (
    <Box
      sx={{
        // padding: 5,
        width: "100%",
        boxSizing: "border-box",
        minHeight: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        // position:"relative"
      }}
    >
      <Box sx={{ padding: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              id="filled-search"
              name="username"
              label="Search by username"
              type="search"
              variant="outlined"
              value={searchObj?.username}
              onChange={(e) => {
                setSearchObj({ ...searchObj, [e.target.name]: e.target.value });
                setIsChangeInFilter(true);
              }}
            />
            <TextField
              id="filled-search"
              name="email"
              label="Search by email"
              type="search"
              value={searchObj?.email}
              onChange={(e) => {
                setSearchObj({ ...searchObj, [e.target.name]: e.target.value });
                setIsChangeInFilter(true);
              }}
              variant="outlined"
            />
            {/* <TextField
              id="filled-search"
              label="Search by number"
              type="search"
              // variant="filled"
            /> */}
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
              onClick={fetchUsers}
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
      </Box>
      <Box
        sx={{
          width: "100%",
          // position:"relative",
          height: "50px",
          color: "gray",
          textAlign: "center",
          paddingBottom: 0,
          marginBottom: 0,
          // bottom:0
        }}
      >
        @all copy rights reserved
      </Box>
    </Box>
  );
};

export default Users;
