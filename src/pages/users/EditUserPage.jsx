// src/pages/users/EditUserPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";

const API_BASE = "http://localhost:3000";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    status: true, // ✅ managed here too
  });

  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [bootLoading, setBootLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const openToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setBootLoading(true);
      try {
        const userRes = await axios.get(`${API_BASE}/users/${id}`, {
          withCredentials: true,
        });
        const user =
          userRes?.data?.user ||
          userRes?.data?.data?.user ||
          userRes?.data?.data ||
          userRes?.data ||
          {};

        if (!mounted) return;

        setForm({
          username: user?.username || "",
          email: user?.email || "",
          mobile: user?.mobile || "",
          status: typeof user?.status === "boolean" ? user.status : true,
        });

        const rolesRes = await axios.get(`${API_BASE}/roles`, {
          withCredentials: true,
        });
        const roleList = (rolesRes?.data?.data?.roles ||
          rolesRes?.data?.data ||
          rolesRes?.data ||
          [])
          .map((r) => ({ _id: r?._id ?? r?.id, name: r?.name }))
          .filter((r) => r._id && r.name);

        setRoles(roleList);

        const roleNameFromUser = user?.role || "";
        const match =
          roleList.find(
            (r) =>
              r.name?.toLowerCase() === String(roleNameFromUser).toLowerCase()
          ) || null;
        setSelectedRoleId(match?._id || "");

        openToast("User loaded", "success");
      } catch (err) {
        openToast(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load user",
          "error"
        );
      } finally {
        if (mounted) setBootLoading(false);
      }
    };

    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleRoleChange = (e) => setSelectedRoleId(e.target.value);
  const handleToggle = (e) => setForm((s) => ({ ...s, status: e.target.checked }));

  const invalid = useMemo(() => {
    const uOK = form.username.trim().length >= 3;
    const eOK = /.+@.+\..+/.test(form.email.trim());
    const mOK = /^[0-9]{10}$/.test(String(form.mobile).trim());
    const rOK = !!selectedRoleId;
    return !(uOK && eOK && mOK && rOK);
  }, [form, selectedRoleId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, role: selectedRoleId, status: !!form.status };
      await axios.put(`${API_BASE}/users/${id}`, payload, {
        withCredentials: true,
      });
      openToast("User updated successfully!", "success");
      setTimeout(() => navigate("/users"), 600);
    } catch (err) {
      openToast(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Update failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const crumbs = [{ label: "Users", to: "/users" }, { label: "Edit User" }];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontSize: "0.85rem",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 2,
          py: 0.75,
        }}
      >
        <PageHeader title="Edit User" crumbs={crumbs} fontSize="1rem" />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2, mt: 9 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Card sx={{ width: "60%", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                User Details
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 5,
                  opacity: bootLoading ? 0.6 : 1,
                  pointerEvents: bootLoading ? "none" : "auto",
                }}
              >
                <TextField
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  size="large"
                  fullWidth
                />
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  size="large"
                  fullWidth
                />
                <TextField
                  label="Mobile (10 digits)"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  size="large"
                  fullWidth
                />
                <FormControl fullWidth size="large">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    label="Role"
                    value={selectedRoleId}
                    onChange={handleRoleChange}
                    MenuProps={{ PaperProps: { style: { maxHeight: 240 } } }}
                  >
                    {roles.map((r) => (
                      <MenuItem key={r._id} value={r._id}>
                        {r.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Status toggle (matches grey styling like Category) */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!form.status}
                      onChange={handleToggle}
                      size="large"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "grey.800" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "grey.800",
                        },
                      }}
                    />
                  }
                  label={form.status ? "Active" : "Inactive"}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            width: "60%",
            mx: "auto",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            mt: 6,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/users")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={saving || bootLoading || invalid}
            sx={{
              bgcolor: !saving ? "grey.800" : "grey.400",
              color: "common.white",
              "&:hover": { bgcolor: !saving ? "grey.900" : "grey.400" },
            }}
          >
            {saving ? "Saving..." : "Save User"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          py: 1,
          fontSize: "0.7rem",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        © {new Date().getFullYear()} ecom
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditUserPage;
