import { Box } from "@mui/material";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import React from "react";
import { useContext } from "react";
import { Context } from "../../../../../App";
import { useSearchParams } from "react-router-dom";

const SortingComponent = ({ ascending, descending }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setOrderingOrder, sortingOrder } = useContext(Context);

  // get sort values
  const getSortValue = () => {
    if (sortingOrder === ascending) {
      return descending;
    } else if (sortingOrder === descending) {
      return ascending;
    } else {
      return ascending;
    }
  };

  // handle sort filter values
  const handleSortingFilter = (value) => {
    setOrderingOrder(value);
    const params = Object.fromEntries([...searchParams]);
    setSearchParams({ ...params, ordering: value });
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      sx={{ cursor: "pointer" }}
      onClick={() => handleSortingFilter(getSortValue())}
    >
      <ArrowDropUp
        sx={{
          mb: "-8px",
          color: sortingOrder === ascending ? "greenyellow" : "white",
        }}
      />
      <ArrowDropDown
        sx={{
          mt: "-8px",
          color: sortingOrder === descending ? "greenyellow" : "white",
        }}
      />
    </Box>
  );
};

export default SortingComponent;
