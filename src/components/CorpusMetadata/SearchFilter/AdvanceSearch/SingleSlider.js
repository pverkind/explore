import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

export default function SingleSlider({ max, handler, label, value }) {
  const [value2, setValue2] = React.useState(value ? value : 0);

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };

  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      <Typography gutterBottom>{label}</Typography>
      <Slider
        value={value2}
        defaultValue={value}
        onChange={handleChange2}
        onChangeCommitted={handler}
        valueLabelDisplay="auto"
        max={max}
      />
    </Box>
  );
}
