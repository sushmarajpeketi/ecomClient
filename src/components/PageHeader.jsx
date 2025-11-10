import React from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const PageHeader = ({ crumbs = [] }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            mx: 1,
            color: "#757575",
          },
        }}
      >
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;

          return isLast ? (
            <Typography
              key={idx}
              sx={{
                fontSize: "1.35rem",
                fontWeight: 600,
                borderBottom: "3px solid #424242",
                paddingBottom: "2px",
                fontFamily: "Poppins, sans-serif",
                color: "#424242",
              }}
            >
              {c.label}
            </Typography>
          ) : (
            <Link
              key={idx}
              component={RouterLink}
              to={c.to}
              underline="hover"
              color="inherit"
              sx={{
                fontSize: "1.25rem",
                fontWeight: 500,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {c.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default PageHeader;
