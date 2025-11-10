import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
// import UsersTable from "../../components/Users/UsersTable";
import { Box, Stack, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
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
    username: "",
    email: "",
  });

  const navigate = useNavigate();

  const buildQueryString = (wantCount) => {
    const p = new URLSearchParams();
    p.set("page", page);
    p.set("rows", rowsPerPage);
    if (searchObj.username?.trim())
      p.set("username", searchObj.username.trim());
    if (searchObj.email?.trim()) p.set("email", searchObj.email.trim());
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
  }, [page, rowsPerPage]);

  const triggerSearch = () => {
    setPage(0);
    fetchUsers(true);
  };

  const pageSetter = (newPage) => setPage(newPage);
  const rowsPerPageSetter = (val) => {
    setRowsPerPage(val);
    setPage(0);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 1,
          // pb: 1,
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 2,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <PageHeader title="Users" crumbs={[{ label: "Users" }]} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          whiteSpace: "nowrap",
          mt: 3,
          ml: 2,
          mr: 2,
          "& .MuiFormControl-root, & .MuiTextField-root": { minWidth: 220 },
          "& .MuiInputBase-root": { height: 40, fontSize: "0.92rem" },
          "& .MuiInputLabel-root": { fontSize: "0.85rem" },
        }}
      >
        <TextField
          size="small"
          name="username"
          label="Search by username"
          value={searchObj.username}
          onChange={(e) =>
            setSearchObj((s) => ({ ...s, [e.target.name]: e.target.value }))
          }
          onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
        />

        <TextField
          size="small"
          name="email"
          label="Search by email"
          value={searchObj.email}
          onChange={(e) =>
            setSearchObj((s) => ({ ...s, [e.target.name]: e.target.value }))
          }
          onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
        />

        <Box sx={{ flex: 1 }} />

        <Stack
          height={"100%"}
          spacing={1.25}
          direction="row"
          alignItems="center"
        >
          <Button
            variant="outlined"
            size="small"
            endIcon={<SearchIcon />}
            onClick={triggerSearch}
            sx={{
              borderColor: "grey.800",
              color: "grey.800",
              "&:hover": { borderColor: "grey.900", color: "grey.900" },
            }}
          >
            Search
          </Button>

          <Button
            variant="contained"
            size="small"
            endIcon={<AddIcon />}
            onClick={() => navigate("/users/add")}
            sx={{
              px: 2.5,
              height: "40px",
              bgcolor: "grey.800",
              color: "common.white",
              "&:hover": { bgcolor: "grey.900" },
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: 2,
          pt: 2,
          pb: 2,
          mt: 1,
          margin: "auto",
          width: "95%",
        }}
      >
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
          mt: 1.5,
          textAlign: "center",
          py: 1.25,
          fontSize: "0.75rem",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        © {new Date().getFullYear()} ecom
      </Box>
    </Box>
  );
};

export default Users;
