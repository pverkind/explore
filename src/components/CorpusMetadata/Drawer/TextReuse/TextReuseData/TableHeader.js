import { Box } from "@mui/material";
import React from "react";
import { Typography } from "@mui/material";
import SortingComponent from "./SortingComponent";

const TableHeader = ({ sortingOrder, setSortingOrder }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        margin: "5px 0px",
        padding: "8px 0px",
        bgcolor: "#7593af",
        color: "white",
        borderRadius: "5px",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        float: "left",
      }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        width={"30%"}
        padding={"0px 15px"}
      >
        Author
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        width={"50%"}
        padding={"0px 15px"}
      >
        Title
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        width={"20%"}
        padding={"0px 15px"}
      >
        Records #
        <SortingComponent
          ascending={"instances_count"}
          descending={"-instances_count"}
          sortingOrder={sortingOrder}
          setSortingOrder={setSortingOrder}
        />
      </Box>
      <Typography width={"10%"} padding={"0px 15px"}></Typography>
    </Box>
  );
};

export default TableHeader;
