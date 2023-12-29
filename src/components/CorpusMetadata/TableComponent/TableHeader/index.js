import { Box, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import SortingComponent from "./SortingButtons/SortingComponent";

const TableHeader = ({ columns, classes }) => {
  const getWidth = (value) => {
    if (value === "More") {
      return "10%";
    } else if (value === "Text Reuse") {
      return "10%";
    } else if (value === "Author Death Date") {
      return "10%";
    } else if (value === "Token Count") {
      return "10%";
    } else if (value === "Book Title") {
      return "30%";
    } else if (value === "Author") {
      return "15%";
    } else if (value === "Version ID") {
      return "15%";
    } else {
      return "auto";
    }
  };

  const returnComponent = (column) => {
    if (column === "Author Death Date ") {
      return (
        <SortingComponent
          ascending={"version__text__author__date"}
          descending={"-version__text__author__date"}
        />
      );
    } else if (column === "Token Count") {
      return (
        <SortingComponent ascending={"tok_length"} descending={"-tok_length"} />
      );
    } else if (column === "Book Title") {
      return (
        <SortingComponent
          ascending={"version__text__title_lat_prefered"}
          descending={"-version__text__title_lat_prefered"}
        />
      );
    } else if (column === "Author") {
      return (
        <SortingComponent
          ascending={"version__text__author__author_lat_prefered"}
          descending={"-version__text__author__author_lat_prefered"}
        />
      );
    } else if (column === "Text Reuse") {
      return (
        <SortingComponent
          ascending={"versionwise_reuse__n_instances"}
          descending={"-versionwise_reuse__n_instances"}
        />
      );
    }
  };

  const getAlign = (value) => {
    if (value === "More") {
      return "flex-end";
    } else if (value === "Text Reuse") {
      return "flex-end";
    } else if (value === "Author Death Date") {
      return "center";
    } else if (value === "Token Count") {
      return "center";
    } else {
      return "flex-start";
    }
  };

  return (
    <TableHead
      sx={{
        color: "text.primary",
        fontSize: 34,
        fontWeight: "medium",
        display: {
          xs: "none",
          sm: "block",
        },
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        width: "100%",
        padding: {
          xs: "10px 0px",
          sm: "0px",
        },
        alignItems: {
          xs: "start",
          sm: "center",
        },
      }}
    >
      <TableRow
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {columns.map((column) => (
          <TableCell
            className={classes.tableHeaderCell}
            key={column.field}
            sx={{
              width: `${getWidth(column.headerName)} !important`,
              height: "40px",
              display: {
                xs: column.headerName === "Author Death Date" ? "none" : "flex",
                sm: "flex",
              },
              alignItems: "center",
              justifyContent: `${getAlign(column.headerName)} !important`,
            }}
          >
            <Box display={"flex"} alignItems={"center"} lineHeight={"18px"}>
              {returnComponent(column.headerName)}
              {column.headerName}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
