import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
} from "@mui/material";
import { useContext } from "react";
import { Context } from "../../App";

export default function VersionDropdown() {
  const { releaseCode, setReleaseCode, setReleaseCodeChanged } =
    useContext(Context);

  // change release code from dropdown
  const handleChange = (event) => {
    console.log("User changed the release code to " + event.target.value);
    localStorage.setItem("release_code", JSON.stringify(event.target.value));
    setReleaseCodeChanged(true);
    setReleaseCode(event.target.value);
  };

  return (
    <Tooltip title="Select the OpenITI release version" placement="top">
      <FormControl
        sx={{
          minWidth: {
            xs: "120px",
            sm: 150,
          },
        }}
        size="small"
      >
        <InputLabel id="demo-select-small-label">Version</InputLabel>
        <Select value={releaseCode} label="Version" onChange={handleChange}>
          <MenuItem value={"2023.1.8"}>2023.1.8</MenuItem>
          <MenuItem value={"2022.2.7"}>2022.2.7</MenuItem>
          <MenuItem value={"2022.1.6"}>2022.1.6</MenuItem>
          <MenuItem value={"2021.2.5"}>2021.2.5</MenuItem>
        </Select>
      </FormControl>
    </Tooltip>
  );
}
