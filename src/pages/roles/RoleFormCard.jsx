import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Switch,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PageHeader from "../../components/PageHeader";

// const FALLBACK_MODULES = ["users", "products", "dashboard", "categories"];
const FALLBACK_OPERATIONS = ["read", "write", "delete"];

export default function RoleFormCard({ mode = "add", id }) {
  const isAdd = mode === "add";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [MODULES, setMODULES] = useState();
  const [OPERATIONS, setOPERATIONS] = useState();

  const [selectedModules,setSelectedModules] = useState()
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true,
    
    permissions: {},
  });

  useEffect(() => {

    (async () => {
        try {
        const res = await axios.get("http://localhost:3000/modules/names", { withCredentials: true });
        const data = res?.data?.data;
       
        if (data?.length) setMODULES(data);
        setOPERATIONS(FALLBACK_OPERATIONS);

       
      } catch(e) {
        toast.error(e?.response?.data?.error||e?.response?.error||e?.response?.message)
      } finally {
        setMetaLoading(false);
      }
    }

  )();
  }, []);

  useEffect(() => {
    if (isAdd || !id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/roles/${id}`, { withCredentials: true });
        const r = res?.data?.data;
        if (!r) throw new Error("Role not found");
        setForm({
          name: r.name || "",
          description: r.description || "",
          isActive: !!r.isActive,
          permissions: r.permissions || {},
        });
      } catch (e) {
        toast.error(e?.response?.data?.error || "Failed to load role");
        navigate("/roles");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isAdd, navigate, isEdit, isView]);

  const disableAll = isView || loading || metaLoading;

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const toggleModule = (module) =>{
    if (disableAll) return;
    setForm((s)=>{
        const currentModuleExist = s.permissions.hasOwnProperty(module)
        let permissions = s.permissions
        if(currentModuleExist){
          delete permissions[module]
          return  {...s,permissions}
        }else{
          const newPermissions  = {...permissions,[module]:["read"]}
          return {...s,permissions:newPermissions}
        }
    })
  }

  const togglePerm = (module, op) => {
    if (disableAll) return;
    setForm((s) => {
      const current = s.permissions?.[module] || []; //current = ["read"] or []
      const exists = current.includes(op);  //exists = true if read
      const nextArr = exists ? current.filter((x) => x !== op) : [...current, op];  //if read , fetch the other operations without read
                                                                                      //if no read , add it in current 
      const next = { ...(s.permissions || {}) };   // next = {products}
      if (nextArr.length === 0) delete next[module]; 
      else next[module] = nextArr;     
      return { ...s, permissions: next };
    });
  };

  const onSubmit = async () => {
    if (!form.name.trim()) return toast.error("Role name is required");
    if (!form.description.trim()) return toast.error("Role description is required");

    setLoading(true);
    try {
      if (isAdd) {
        await axios.post(
          "http://localhost:3000/roles/create-role",
          {
            name: form.name.trim(),
            description: form.description.trim(),
            permissions: form.permissions,
            isActive: form.isActive,
          },
          { withCredentials: true }
        );
        toast.success("Role created successfully");
      } else if (isEdit) {
        await axios.put(
          `http://localhost:3000/roles/edit/${id}`,
          {
            name: form.name.trim(),
            description: form.description.trim(),
            permissions: form.permissions,
            isActive: form.isActive,
          },
          { withCredentials: true }
        );
        toast.success("Role updated successfully");
      }
      navigate("/roles");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const wrapIfView = (child) =>
    isView ? (
      <Tooltip title="View only" arrow disableInteractive>
        <span style={{ pointerEvents: "auto" }}>{child}</span>
      </Tooltip>
    ) : (
      child
    );

  const Title = isAdd ? "Add Role" : isEdit ? "Edit Role" : "View Role";
  const crumbs = [{ label: "Roles", to: "/roles" }, { label: Title }];

  return (
    <>
     {
    metaLoading ? <>"Loading...."</> :
    (
       <Box sx={{ height: "100%", display: "flex", flexDirection: "column", fontSize: "0.85rem" }}>
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
        <PageHeader title={Title} crumbs={crumbs} fontSize="1rem" />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 ,mt:3}}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Card sx={{ width: "90%", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                {wrapIfView(
                  <TextField
                    label="Role Name"
                    name="name"
                    value={form.name}
                    onChange={handleBasicChange}
                    size="small"
                    fullWidth
                    disabled={disableAll}
                    inputProps={isView ? { readOnly: true } : {}}
                  />
                )}
                {wrapIfView(
                  <TextField
                    label="Role Description"
                    name="description"
                    value={form.description}
                    onChange={handleBasicChange}
                    size="small"
                    fullWidth
                    disabled={disableAll}
                    inputProps={isView ? { readOnly: true } : {}}
                  />
                )}
              </Box>

              <Divider />

              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>Permissions</Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                {MODULES?.map((mod) => {
                  
                  const selected = form.permissions?.[mod] || [];
                  return (
                    <Box
                      key={mod}
                      sx={{
                        p: 1.5,
                        border: "1px solid #e5e5e5",
                        borderRadius: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                      title={isView ? "View only" : undefined}
                    > 
                     
                          <FormControlLabel
                            key={`${mod}`}
                            control={
                              <Checkbox
                                size="small"
                                
                                checked={form.permissions.hasOwnProperty(mod)}
                                onChange={() => toggleModule(mod)}
                                disabled={disableAll}
                                
                              />
                            }
                            label={<Typography sx={{ fontWeight: 600, textTransform: "capitalize", fontSize: "0.9rem" }}>{mod}</Typography>}
                          />
                        
                

                      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", opacity: isView ? 0.9 : 1 }}>
                        {OPERATIONS.map((op) => (
                          <FormControlLabel
                            key={`${mod}-${op}`}
                            control={
                              <Checkbox
                                size="small"
                                checked={selected.includes(op)}
                                onChange={() => togglePerm(mod, op)}
                                disabled={disableAll}
                              />
                            }
                            label={<Typography sx={{ fontSize: "0.8rem" }}>{op}</Typography>}
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {wrapIfView(
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))}
                      disabled={disableAll}
                    />
                  }
                  label={form.isActive ? "Active" : "Inactive"}
                  sx={{ fontSize: "0.85rem" }}
                />
              )}
            </CardContent>
          </Card>
        </Box>

      
        <Box
          sx={{
            width: "90%",
            mx: "auto",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            mt: 2,
          }}
        >
          <Button variant="outlined" size="small" onClick={() => navigate("/roles")} disabled={loading}>
            {isView ? "Back" : "Cancel"}
          </Button>

          {!isView && (
            <Button variant="contained" size="small" disabled={loading} onClick={onSubmit}>
              {loading ? (isAdd ? "Saving..." : "Updating...") : isAdd ? "Save Role" : "Update Role"}
            </Button>
          )}
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
    </Box>
    )
  }
   
    </>
 
  );
}
