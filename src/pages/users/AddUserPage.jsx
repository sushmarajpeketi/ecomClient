import React from 'react'
import PageHeader from '../../components/PageHeader'
import {
  Box,
 Paper
} from "@mui/material";
const AddUserPage = () => {
  return (
    <Box sx={{ p: 5 }}>
      <PageHeader
        title="Add user"
        crumbs={[{ label: "add user", to: "/users" }, { label: "add user" }]}
      />

      <Paper sx={{ p: 3 }}>
        
      </Paper>
    </Box>
  )
}

export default AddUserPage