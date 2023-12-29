import { CircularProgress } from "@mui/material";
import { Box } from "@mui/material";
import React from "react";

const CircularInterminate = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "150px",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default CircularInterminate;
