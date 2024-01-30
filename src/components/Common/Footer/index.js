import { Box } from "@mui/material";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

const Footer = () => {
  return (
    <Box
      sx={{
        px: {
          xs: "20px",
          sm: "100px",
        },
        py: {
          xs: "30px",
          sm: "80px",
        },
        bgcolor: "#2862a5",
        display: "flex",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        sx={{
          width: {
            xs: "100%",
            sm: "1380px",
          },
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
          },
          justifyContent: {
            xs: "start",
            sm: "center",
          },
        }}
      >
        <LeftSide />
        <RightSide />
      </Box>
    </Box>
  );
};

export default Footer;
