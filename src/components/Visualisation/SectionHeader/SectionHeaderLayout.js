import { Box, Typography } from "@mui/material";
import React from "react";
import ToggleButton from "./ToggleButton";
import BAExtra from "./BookAlignmentHeader/BAExtra";
import { useContext } from "react";
import { Context } from "../../../App";

const SectionHeaderLayout = ({ item, children, toggle, setToggle }) => {
  const { showOptions } = useContext(Context);
  return (
    <Box mb="20px">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        gap={"0px"}
        sx={{
          alignItems: "center",
          height: "60px",
          px: {
            xs: "10px",
            sm: "25px",
          },
          gap: "10px",
          bgcolor: "#F0F0F5",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "2px",
            width: "max-content",
          }}
        >
          {item.icon !== "" && (
            <i className={item.icon} style={{ width: "25px" }} />
          )}
          <Typography textTransform={"none"} color={"black"}>
            {item.title}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <ToggleButton setToggle={setToggle} toggle={toggle} />
        </Box>
      </Box>
      {item.title === "Books" && showOptions && <BAExtra />}
    </Box>
  );
};

export default SectionHeaderLayout;
