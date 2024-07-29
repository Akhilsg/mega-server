import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton } from "@mui/material";

export default function Notifications() {
  return (
    <IconButton color="primary">
      <NotificationsIcon
        fontSize="inherit"
        sx={{ color: "white", fontSize: "30px" }}
      />
    </IconButton>
  );
}
