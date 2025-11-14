// src/pages/users/Users.jsx (updated footer + layout)
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Box, Stack, TextField, Button, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { userContext } from "../../context/userContext";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import UsersTable from "../../components/Users/UsersTable";

const Users = () => {
  const { user: globalUser } = useContext(userContext);

  const [length, setLength] = useState(0);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchObj, setSearchObj] = useState({
    searchWord: "",
    from: null,
    to: null,
  });

  const navigate = useNavigate();
  const buildQueryString = (wantCount) => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("rows", String(rowsPerPage));
    if (searchObj.searchWord?.trim())
      p.set("searchWord", searchObj.searchWord.trim());
    if (searchObj.from)
      p.set("from", searchObj.from.startOf("day").toISOString());
    if (searchObj.to) p.set("to", searchObj.to.endOf("day").toISOString());
    if (wantCount) p.set("length", "true");
    return `?${p.toString()}`;
  };

  const fetchUsers = async (wantCount = false) => {
    try {
      const qs = buildQueryString(wantCount);
      const res = await axios.get(`http://localhost:3000/users${qs}`, {
        withCredentials: true,
      });
      setUsers(res?.data?.data?.users || []);
      if (res?.data?.data?.count !== undefined) setLength(res.data.data.count);
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e.message || "Failed to fetch users"
      );
    }
  };

  useEffect(() => {
    if (page === 0) fetchUsers(true);
    else fetchUsers(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      fetchUsers(true);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchObj.from, searchObj.to]);

  const triggerSearch = () => {
    setPage(0);
    fetchUsers(true);
  };

  const clearFilters = () => {
    setSearchObj({ searchWord: "", from: null, to: null });
    setPage(0);
    fetchUsers(true);
  };

  return (
    <Box
      sx={{
        p: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        // overflowY:"hidden"
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 2,
          px: 2,
          pt: 1,
          pb: 1,
          bgcolor: "background.paper",
        }}
      >
        <PageHeader title="Users" crumbs={[{ label: "Users" }]} />
        <Divider sx={{ my: 2 }} />

        {/* Filters Row inside a form for Enter key to submit */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            triggerSearch();
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
            >
              <Tooltip title="Search by username, email, mobile, or role" arrow>
                <TextField
                  size="small"
                  name="searchWord"
                  label="Search"
                  value={searchObj.searchWord}
                  onChange={(e) =>
                    setSearchObj((s) => ({
                      ...s,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  sx={{ minWidth: 220 }}
                />
              </Tooltip>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From"
                  value={searchObj.from}
                  onChange={(v) => setSearchObj((s) => ({ ...s, from: v }))}
                  maxDate={searchObj.to || undefined}
                  format="DD MMM YYYY"
                  slotProps={{ textField: { size: "small" } }}
                />
                <DatePicker
                  label="To"
                  value={searchObj.to}
                  onChange={(v) => setSearchObj((s) => ({ ...s, to: v }))}
                  minDate={searchObj.from || undefined}
                  format="DD MMM YYYY"
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
            </Stack>

            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                type="submit"
                variant="outlined"
                size="large"
                endIcon={<SearchIcon />}
                sx={{
                  borderColor: "grey.800",
                  color: "grey.800",
                  "&:hover": { borderColor: "grey.900", color: "grey.900" },
                }}
              >
                Search
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={clearFilters}
                sx={{ height: 40 }}
              >
                Clear
              </Button>

              {globalUser?.permissions["users"].includes("edit") ? (
                 <Button
                variant="contained"
                size="small"
                endIcon={<AddIcon />}
                onClick={() => navigate("/users/add")}
                sx={{
                  px: 2.5,
                  height: 40,
                  bgcolor: "grey.800",
                  color: "common.white",
                  "&:hover": { bgcolor: "grey.900" },
                }}
              >
                Add
              </Button>
              ) : null}

             
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Main */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: 2,
          pb: 2,
        }}
      >
        <UsersTable
          user={globalUser}
          users={users}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageSetter={setRowsPerPage}
          pageSetter={setPage}
          length={length}
          onDelete={async (id) => {
            await axios.delete(`http://localhost:3000/users/${id}`, {
              withCredentials: true,
            });
            await fetchUsers(true);
          }}
        />
      </Box>
      <Box
        component="footer"
        sx={{
          mt: 2,
          position: "static",
          width: "100%",
          bgcolor: "grey.300",
          color: "text.primary",
          textAlign: "center",
          lineHeight: "40px",
          height: 40,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        © {new Date().getFullYear()} ecom
      </Box>
    </Box>
  );
};

export default Users;
