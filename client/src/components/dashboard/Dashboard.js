import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import Image from "./Image";

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);

  return (
    <Box
      sx={{
        p: 5,
        display: "flex",
        position: "relative",
        flexDirection: "row",
        height: "30vh",
        textAlign: "left",
        color: "white",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0)",
        backgroundImage:
          "linear-gradient(to right, rgba(20, 26, 33, 0.88) 0%, rgb(20, 26, 33) 75%), url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/background-5.webp)",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundSize: "cover",
        border: "1px solid #1C252E",
        borderRadius: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 700,
            whiteSpace: "pre-line",
          }}
        >
          Welcome back 👋 {user.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Take a study set to start your day of studying. Enjoy!
        </Typography>
        <Button variant="contained" color="primary">
          Go now
        </Button>
      </Box>
      <Box sx={{ minWidth: "260px" }}>
        <Image />
      </Box>
    </Box>
  );
}
