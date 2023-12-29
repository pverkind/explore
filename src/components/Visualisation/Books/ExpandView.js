import { Box, IconButton, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import Contents from "./Contents";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../../../App";
import { parseImech } from "../../../utility/Helper";

// open the reader (read 300 milestones at once)
const ExpandView = ({ open, handleClose, data, alignmentOnly }) => {
  const { metaData, books, setBooks } = useContext(Context);
  console.log("ExpandView");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100vh",
    bgcolor: "background.paper",
    boxSizing: "border-box",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const bookNumber = data?.bookNumber;

  // calculate the last milestone in the entire book:
  const lastMsInBook = Math.ceil(data?.ms / 300);

  // get the 300 milestones data that was loaded from i.mech:
  const section300Ms = data?.bookNumber === 1 ? books?.book1 : books?.book2;

  // get the milestone dictionary (ms: ms_text) from that object:
  const sectionMsDict = section300Ms?.content ? section300Ms?.content : {};

  // get the number of the first and last milestones in the downloaded section:
  const lastDownloadedMS =
    Object.keys(sectionMsDict)[Object.keys(sectionMsDict).length - 1];
  const firstDownloadedMS = parseInt(Object.keys(sectionMsDict)[0]) - 1;

  // handle downloading more milestones from i.mech
  // (after last downloaded milestone):
  const handleNext = async () => {
    setIsLoading(true);
    if (lastMsInBook > lastDownloadedMS) {
      const msSection = () => {
        return parseInt(lastDownloadedMS) + 300;
      };
      const annotated =
        (bookNumber === 1
          ? metaData?.book1?.annotationStatus
          : metaData?.book2.annotationStatus) === "(not yet annotated)"
          ? ""
          : `.${
              bookNumber === 1
                ? metaData?.book1?.annotationStatus
                : metaData?.book2.annotationStatus
            }`;
      const version = `${
        bookNumber === 1
          ? metaData?.book1?.versionCode
          : metaData?.book2.versionCode
      }-ara1${annotated}`;

      const response = await axios.get(
        `https://raw.githubusercontent.com/OpenITI/i.mech/master/data/${version}-${msSection()
          .toString()
          .padStart(5, "0")}`
      );
      const parsedBook = parseImech(response.data);
      const updatedData =
        bookNumber === 1
          ? { ...books?.book1?.content, ...parsedBook }
          : { ...books?.book2?.content, ...parsedBook };

      if (bookNumber === 1) {
        setBooks({
          ...books,
          book1: { ...books?.book1, content: updatedData },
        });
      } else {
        setBooks({
          ...books,
          book2: { ...books?.book2, content: updatedData },
        });
      }
      setIsLoading(false);
    }
  };

  // handle downloading more milestones from i.mech
  // (before first downloaded milestone):
  const handlePrev = async () => {
    setIsLoading(true);
    if (firstDownloadedMS >= 300) {
      const msSection = () => {
        return firstDownloadedMS;
      };
      const annotated =
        (bookNumber === 1
          ? metaData?.book1?.annotationStatus
          : metaData?.book2.annotationStatus) === "(not yet annotated)"
          ? ""
          : `.${
              bookNumber === 1
                ? metaData?.book1?.annotationStatus
                : metaData?.book2.annotationStatus
            }`;
      const version = `${
        bookNumber === 1
          ? metaData?.book1?.versionCode
          : metaData?.book2.versionCode
      }-ara1${annotated}`;

      const response = await axios.get(
        `https://raw.githubusercontent.com/OpenITI/i.mech/master/data/${version}-${msSection()
          .toString()
          .padStart(5, "0")}`
      );
      const parsedBook = parseImech(response.data);
      const updatedData =
        bookNumber === 1
          ? { ...books?.book1?.content, ...parsedBook }
          : { ...books?.book2?.content, ...parsedBook };

      if (bookNumber === 1) {
        setBooks({
          ...books,
          book1: { ...books?.book1, content: updatedData },
        });
      } else {
        setBooks({
          ...books,
          book2: { ...books?.book2, content: updatedData },
        });
      }
      setIsLoading(false);
    }
  };
  console.log("Render ExpandView");
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          display={"flex"}
          height={"50px"}
          width={"100%"}
          bgcolor={"#f3f4f6"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box px={"20px"}>
            <Typography variant="body1">
              {data?.bookNumber === 1 ? "Book 1" : "Book 2"} {": "}
              {section300Ms?.title} {data?.ms}
            </Typography>
          </Box>

          <Box px={"20px"} display={"flex"} alignItems={"center"} gap={"10px"}>
            <IconButton
              sx={{ fontSize: "18px" }}
              onClick={() => setFontSize(fontSize <= 16 ? 16 : fontSize - 4)}
            >
              <i className="fa-solid fa-minus"></i>
            </IconButton>
            <IconButton
              sx={{ fontSize: "18px" }}
              onClick={() => setFontSize(fontSize >= 40 ? 40 : fontSize + 4)}
            >
              <i className="fa-solid fa-plus"></i>
            </IconButton>
            <IconButton sx={{ fontSize: "18px" }} onClick={handleClose}>
              <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            height: "calc(100vh - 50px)",
            width: "100%",
            overflow: "hidden",
            overflowY: "scroll",
            px: {
              sm: "30px",
              lg: "200px",
              xl: "400px",
            },
            boxSizing: "border-box",
          }}
        >
          <Box pt="50px">
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "max-content",
                  py: "20px",
                }}
              >
                <CircularProgress size={30} />
              </Box>
            )}
            {!isLoading && firstDownloadedMS >= 150 ? (
              <Button sx={{ width: "100%", mt: "5px" }} onClick={handlePrev}>
                Load Previous
              </Button>
            ) : (
              ""
            )}

            {firstDownloadedMS === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "max-content",
                  pt: "50px",
                }}
              >
                <Typography fontWeight={600} variant="h5">
                  Start Of The Book
                </Typography>
              </Box>
            ) : (
              ""
            )}
          </Box>
          <Contents
            fullWidth
            data={section300Ms}
            fontSize={fontSize}
            bookNumber={data?.bookNumber}
            alignmentOnly={alignmentOnly}
            parsedBookAlignment={data}
            isLeft={true}
          />
          <Box pb="50px">
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "max-content",
                  py: "20px",
                }}
              >
                <CircularProgress size={30} />
              </Box>
            )}
            {!isLoading && lastMsInBook > lastDownloadedMS ? (
              <Button sx={{ width: "100%", mt: "5px" }} onClick={handleNext}>
                Load Next
              </Button>
            ) : (
              ""
            )}

            {lastMsInBook <= lastDownloadedMS ? (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "max-content",
                  py: "60px",
                }}
              >
                <Typography fontWeight={600} variant="h5">
                  The End Of BOOk
                </Typography>
              </Box>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExpandView;
