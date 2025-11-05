import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import UsersTable from "./UsersTable";
import { Box, Stack, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { userContext } from "../../context/userContext";

const Users = () => {
  const { user: globalUser } = useContext(userContext);

  const [length, setLength] = useState(0);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchObj, setSearchObj] = useState({
    username: "",
    email: "",
  });

  // ✅ Build query string
  const buildQueryString = (wantCount) => {
    let query = "";

    if (searchObj.username?.trim()) {
      query += `&username=${searchObj.username}`;
    }
    if (searchObj.email?.trim()) {
      query += `&email=${searchObj.email}`;
    }

    if (wantCount) {
      query += `&length=true`; // ✅ only request count when needed
    }

    return query;
  };

  // ✅ API to fetch users
  const fetchUsers = async (wantCount = false) => {
    try {
      const queryString = buildQueryString(wantCount);

      const res = await axios.get(
        `http://localhost:3000/users?page=${page}&rows=${rowsPerPage}${queryString}`,
        { withCredentials: true }
      );

      setUsers(res?.data?.data?.users || []);

      // ✅ only update count when backend sends it
      if (res?.data?.data?.count !== undefined) {
        setLength(res.data.data.count);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  // ✅ Effect handles pagination + initial load
  useEffect(() => {
    if (page === 0) {
      fetchUsers(true); // ✅ always get count on page 0
    } else {
      fetchUsers(false); // ✅ don't request count when changing pages
    }
  }, [page, rowsPerPage]);

  // ✅ Search button click
  const handleSearchClick = () => {
    setPage(0); // ✅ reset pagination
    fetchUsers(true); // ✅ get filtered count + data
  };

  // ✅ Page setter
  const pageSetter = (newPage) => {
    setPage(newPage);
  };

  // ✅ Rows per page setter
  const rowsPerPageSetter = (val) => {
    setRowsPerPage(val);
    setPage(0); // ✅ reset to page 0 always
  };

  // ✅ Edit handler
  const editHandler = async (id, data) => {
    try {
      await axios.put(`http://localhost:3000/users/${id}`, data);
      fetchUsers(false); // ✅ only fetch users, not count
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ padding: 5 }}>
        {/* ✅ SEARCH BAR */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              name="username"
              label="Search by username"
              variant="outlined"
              value={searchObj.username}
              onChange={(e) =>
                setSearchObj({ ...searchObj, [e.target.name]: e.target.value })
              }
            />

            <TextField
              name="email"
              label="Search by email"
              variant="outlined"
              value={searchObj.email}
              onChange={(e) =>
                setSearchObj({ ...searchObj, [e.target.name]: e.target.value })
              }
            />
          </Box>

          <Stack spacing={2} direction="row" alignItems="center">
            <Button
              variant="outlined"
              endIcon={<SearchIcon />}
              onClick={handleSearchClick}
            >
              Search
            </Button>
            <Button variant="contained" endIcon={<AddIcon />}>
              Add
            </Button>
          </Stack>
        </Box>

        {/* ✅ TABLE */}
        <UsersTable
          users={users}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageSetter={rowsPerPageSetter}
          pageSetter={pageSetter}
          length={length}
          onEdit={editHandler}
        />
      </Box>

      <Box sx={{ textAlign: "center", padding: 1, color: "gray" }}>
        @all copyrights reserved
      </Box>
    </Box>
  );
};

export default Users;
