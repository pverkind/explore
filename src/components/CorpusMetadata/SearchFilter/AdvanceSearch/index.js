import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Context } from "../../../../App";
import CustomTextInput from "./CustomTextInput";
import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import MultiSlider from "./MultiSlider";
import SingleSlider from "./SingleSlider";
import { Grid } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    md: "35%",
  },
  maxHeight: "80%",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: {
    xs: "30px",
    md: "50px",
  },
  overflowY: "scroll",
  boxSizing: "border-box",
};

export default function AdvanceSearch() {
  const {
    advanceSearchModal,
    setAdvanceSearchModal,
    advanceSearch,
    setAdvanceSearch,
  } = useContext(Context);

  const [searchParams, setSearchParams] = useSearchParams();
  const [tempAdvanceSearch, setTempAdvanceSearch] = React.useState({
    // max_char_count: "",
    // min_char_count: "",
    max_tok_count: "",
    min_tok_count: "",
    editor: "",
    edition_place: "",
    publisher: "",
    edition_date: "",
    died_before_AH: "",
    died_after_AH: "",
  });

  // handle advance searches

  const handleChangeAdvanceSearch = (event) => {
    setTempAdvanceSearch({
      ...tempAdvanceSearch,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeCommitted = (e, newVal) => {
    setTempAdvanceSearch({
      ...tempAdvanceSearch,
      max_tok_count: newVal[1],
      min_tok_count: newVal[0],
    });
  };

  const handleSingleChangeCommitted_Before = (e, newVal) => {
    setTempAdvanceSearch({
      ...tempAdvanceSearch,
      died_before_AH: newVal,
    });
  };

  const handleSingleChangeCommitted_After = (e, newVal) => {
    setTempAdvanceSearch({
      ...tempAdvanceSearch,
      died_after_AH: newVal,
    });
  };

  const handleSubmitAdvanceSearch = () => {
    setAdvanceSearch(tempAdvanceSearch);
    const params = Object.fromEntries([...searchParams]);
    // if (tempAdvanceSearch?.max_char_count !== "") {
    //   setSearchParams({
    //     ...params,
    //     max_char_count: tempAdvanceSearch.max_char_count,
    //   });
    // } else {
    //   searchParams.delete("max_char_count");
    //   setSearchParams(searchParams);
    // }
    // if (tempAdvanceSearch?.min_char_count !== "") {
    //   setSearchParams({
    //     ...params,
    //     min_char_count: tempAdvanceSearch.min_char_count,
    //   });
    // } else {
    //   searchParams.delete("min_char_count");
    //   setSearchParams(searchParams);
    // }
    const allSearchParams = {
      ...(params || {}),
      max_tok_count: tempAdvanceSearch?.max_tok_count,
      min_tok_count: tempAdvanceSearch?.min_tok_count,
      editor: tempAdvanceSearch?.editor,
      publisher: tempAdvanceSearch?.publisher,
      edition_date: tempAdvanceSearch?.edition_date,
      died_before_AH: tempAdvanceSearch?.died_before_AH,
      died_after_AH: tempAdvanceSearch?.died_after_AH,
    };

    // Remove properties with undefined or null values
    for (const key in allSearchParams) {
      if (
        allSearchParams[key] === "" ||
        allSearchParams[key] === 0 ||
        allSearchParams[key] === null
      ) {
        delete allSearchParams[key];
      }
    }

    setSearchParams(allSearchParams);
    setAdvanceSearchModal(false);
  };

  React.useEffect(() => {
    setAdvanceSearch({
      // max_char_count: searchParams.get("max_char_count")
      //   ? searchParams.get("max_char_count")
      //   : "",
      // min_char_count: searchParams.get("min_char_count")
      //   ? searchParams.get("min_char_count")
      //   : "",
      max_tok_count: searchParams.get("max_tok_count")
        ? searchParams.get("max_tok_count")
        : "",
      min_tok_count: searchParams.get("min_tok_count")
        ? searchParams.get("min_tok_count")
        : "",
      editor: searchParams.get("editor") ? searchParams.get("editor") : "",
      edition_place: searchParams.get("edition_place")
        ? searchParams.get("edition_place")
        : "",
      publisher: searchParams.get("publisher")
        ? searchParams.get("publisher")
        : "",
      edition_date: searchParams.get("edition_date")
        ? searchParams.get("edition_date")
        : "",
      died_before_AH: searchParams.get("died_before_AH")
        ? searchParams.get("died_before_AH")
        : "",
      died_after_AH: searchParams.get("died_after_AH")
        ? searchParams.get("died_after_AH")
        : "",
    });
  }, [searchParams, setAdvanceSearch]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={advanceSearchModal}
      onClose={() => setAdvanceSearchModal(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={advanceSearchModal}>
        <Box sx={style}>
          <Typography
            id="transition-modal-title"
            variant="h5"
            sx={{ mb: "20px" }}
          >
            Advanced Search
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", mt: "5px" }}>
            <MultiSlider
              min={advanceSearch?.min_tok_count}
              max={advanceSearch?.max_tok_count}
              handler={handleChangeCommitted}
              label={"Token Count:"}
            />

            <Grid container spacing="30px" sx={{ mt: "0px" }}>
              <Grid item xs={12} md={6}>
                <SingleSlider
                  max={20000}
                  value={advanceSearch?.died_before_AH}
                  handler={handleSingleChangeCommitted_Before}
                  label={"Author Died Before: "}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <SingleSlider
                  max={20000}
                  value={advanceSearch?.died_after_AH}
                  handler={handleSingleChangeCommitted_After}
                  label={"Author Died After: "}
                />
              </Grid>
            </Grid>
            <CustomTextInput
              label={"Editor of the paper version:"}
              value={tempAdvanceSearch.editor}
              handler={handleChangeAdvanceSearch}
              name={"editor"}
            />
            <CustomTextInput
              label={"Place of the edition of the paper version:"}
              value={tempAdvanceSearch.edition_place}
              handler={handleChangeAdvanceSearch}
              name={"edition_place"}
            />
            <CustomTextInput
              label={"Publisher of the paper version:"}
              value={tempAdvanceSearch.publisher}
              handler={handleChangeAdvanceSearch}
              name={"publisher"}
            />
            <CustomTextInput
              label={"Edition date of the paper version:"}
              value={tempAdvanceSearch.edition_date}
              handler={handleChangeAdvanceSearch}
              name={"edition_date"}
            />
            {/* <CustomTextInput label={"Version tags contain:"} />
            <CustomTextInput label={"Version text titles ar contains:"} />
            <CustomTextInput
              label={"Version text author author ar contains:"}
            />
            <CustomTextInput
              label={"Version text author author lat contains:"}
            />
            <CustomTextInput
              label={"Version text author date AH is greater than:"}
            />
            <CustomTextInput
              label={"Version text author date AH is less than:"}
            />
            <CustomTextInput
              label={"Version text author date AH is in range:"}
            />
            <CustomTextInput
              label={"Version text author name elements shuhra contains:"}
            />
            <CustomTextInput
              label={"Version text author name elements ism contains:"}
            />
            <CustomTextInput
              label={"Version text author name elements nasab contains:"}
            />
            <CustomTextInput
              label={"Version text author name elements kunya contains:"}
            />
            <CustomTextInput
              label={"Version text author name elements laqab contains:"}
            />
            <CustomTextInput
              label={"Version text author name elements nisba contains:"}
            /> */}
            <Box mt="10px" display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{ height: "48px", px: "50px" }}
                onClick={handleSubmitAdvanceSearch}
              >
                <Typography variant="body1" sx={{ textTransform: "none" }}>
                  Search
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
