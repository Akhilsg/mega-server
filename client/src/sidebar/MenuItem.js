import { Box, ButtonBase, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MenuItem({ open, linkName, name, icon }) {
  const navigate = useNavigate();

  return (
    <ButtonBase
      onClick={() => navigate(linkName)}
      sx={{
        display: "flex",
        ...(!open && {
          flexDirection: "column",
          px: 2,
        }),
        cursor: "pointer",
        justifyContent: "start",
        width: "100%",
        backgroundColor:
          window.location.pathname === linkName
            ? "rgba(0, 167, 111, 0.08)"
            : "transparent",
        padding: 1.5,
        borderRadius: "8px",
        color:
          window.location.pathname === linkName
            ? "#5BE49B"
            : "rgb(145, 158, 171)",
        // fontWeight: 600,
        fontSize: open ? "0.875rem" : "0.625rem",
        minHeight: "44px",
        "&:hover": {
          backgroundColor:
            window.location.pathname === linkName
              ? "rgba(0, 167, 111, 0.16)"
              : "rgba(145, 158, 171, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          width: "24px",
          height: "24px",
          mr: open && 1.5,
          display: "inline-flex",
          backgroundColor: "currentcolor",
          mask: icon,
        }}
      />{" "}
      <Typography
        sx={{
          fontWeight: window.location.pathname === linkName ? 600 : 500,
          fontSize: open ? "0.875rem" : "0.625rem",
        }}
      >
        {name}
      </Typography>
    </ButtonBase>
  );
}
