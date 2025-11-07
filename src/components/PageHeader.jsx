import React from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const PageHeader = ({ title, crumbs = [] }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>

      <Breadcrumbs aria-label="breadcrumb">
        {crumbs.map((c, idx) =>
          c.to ? (
            <Link
              key={idx}
              component={RouterLink}
              to={c.to}
              underline="hover"
              color="inherit"
            >
              {c.label}
            </Link>
          ) : (
            <Typography key={idx} color="text.primary">
              {c.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default PageHeader;
