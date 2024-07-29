import { Box, Typography } from "@mui/material";
import React from "react";

export default function StatsCard({ imageSrc, label, stat, gradient, color }) {
  return (
    <Box
      sx={{
        zIndex: 0,
        position: "relative",
        overflow: "hidden",
        boxShadow: "none",
        //   marginRight: "12px",
        borderRadius: "16px",
        backgroundColor: "rgb(255, 255, 255)",
        width: "24%",
        backgroundImage: gradient,
        color: color,
        p: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        {" "}
        <img alt="glass icon" src={imageSrc} width={50} height={50} />
      </Box>
      <Box>
        <Typography
          color={color}
          variant="h5"
          fontSize="14px"
          fontWeight={600}
          mb={1}
        >
          {label}
        </Typography>
        <Typography
          // variant="h4"
          fontWeight={700}
          sx={{
            color: color,
            fontSize: "1.8rem",
            lineHeight: 1.5,
          }}
        >
          {stat}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "240px",
          height: "240px",
          flexShrink: 0,
          display: "inline-flex",
          backgroundColor: "currentcolor",
          mask: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/shape-square.svg) center center / contain no-repeat",
          top: 0,
          left: -20,
          zIndex: -1,
          opacity: 0.24,
          position: "absolute",
          color: color,
        }}
      />
    </Box>
  );
}
