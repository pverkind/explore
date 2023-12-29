import { Box } from "@mui/material";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

const SortingComponent = ({
  ascending,
  descending,
  sortingOrder,
  setSortingOrder,
}) => {
  const handleSortingFilter = (e) => {
    e.preventDefault();
    if (sortingOrder === ascending) {
      setSortingOrder(descending);
    } else {
      setSortingOrder(ascending);
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      sx={{ cursor: "pointer" }}
      onClick={(e) => handleSortingFilter(e)}
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
