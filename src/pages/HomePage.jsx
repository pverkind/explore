import React from "react";
import Layout from "../components/Common/Layouts";
import { Box, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Layout>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        minHeight={"50vh"}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "50px",
              sm: "120px",
            },
          }}
        >
          Welcome
        </Typography>
      </Box>
    </Layout>
  );
};

export default HomePage;
