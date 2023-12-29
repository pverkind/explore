import React, { useContext } from "react";
import { Context } from "../../../../App";
import ExpandView from "../../Books/ExpandView";
import {
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@mui/material";
import NextMilestoneLoader from "../NextMilestoneLoader";
import "../../../../index.css";
import { imechToHtml } from "../../../../utility/Helper";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useState } from "react";

const DiffGrid = ({ parsedBookAlignment, alignmentOnly }) => {
  console.log("parsedBookAlignment", parsedBookAlignment);
  const { isFlipped, books, displayMs, setDisplayMs } = useContext(Context);

  const [open, setOpen] = React.useState(false);
  const [expandViewData, setExpandViewData] = useState({
    data: {},
    bookNumber: null,
    ms: "",
  });

  let columns = [
    {
      field: "book1",
      headerName: `${books.book1.title} (milestone ${books.book1.ms})`,
    },
    {
      field: "book2",
      headerName: `${books.book2.title} (milestone ${books.book2.ms})`,
    },
  ];
  columns = isFlipped ? columns.reverse() : columns;

  const createMsContext = (
    msNo,
    beforeAlignment,
    afterAlignment,
    displayMs
  ) => {
    let before = [];
    let after = [];
    const sortedKeys = Object.keys(displayMs).sort();
    after.push(`<div>${imechToHtml(afterAlignment)}</div>`);
    for (let k of sortedKeys) {
      if (parseInt(k) < msNo) {
        before.push(
          `<div class="msNo">(start of ms${k})</div><div>${imechToHtml(
            displayMs[k]
          )}</div>`
        );
      } else if (parseInt(k) > msNo) {
        after.push(
          `<div class="msNo">(start of ms${k})</div><div>${imechToHtml(
            displayMs[k]
          )}</div>`
        );
      }
    }
    before.push(
      `<div class="msNo">(start of ms${msNo})</div><div>${imechToHtml(
        beforeAlignment
      )}</div>`
    );
    return [before.join("\n"), after.join("\n")];
  };
  const [before1, after1] = createMsContext(
    books.book1.ms,
    parsedBookAlignment.beforeAlignment1,
    parsedBookAlignment.afterAlignment1,
    displayMs.book1
  );
  const [before2, after2] = createMsContext(
    books.book2.ms,
    parsedBookAlignment.beforeAlignment2,
    parsedBookAlignment.afterAlignment2,
    displayMs.book2
  );
  const beforeAlignmentRow = [
    {
      book1: before1,
      book2: before2,
    },
  ];
  const afterAlignmentRow = [
    {
      book1: after1,
      book2: after2,
    },
  ];
  /*const beforeAlignmentRow = [
    { 
        book1: imechToHtml(parsedBookAlignment.beforeAlignment1), 
        book2: imechToHtml(parsedBookAlignment.beforeAlignment2)
    }
  ];*/
  const alignmentRows = [];
  const splitS1 = parsedBookAlignment.s1.split(/ *###NEW_ROW### */g);
  const splitS2 = parsedBookAlignment.s2.split(/ *###NEW_ROW### */g);
  for (let i = 0; i < splitS1.length; i++) {
    alignmentRows.push({
      book1: splitS1[i],
      book2: splitS2[i],
    });
  }
  /*const afterAlignmentRow = [
    { 
        book1: imechToHtml(parsedBookAlignment.afterAlignment1), 
        book2: imechToHtml(parsedBookAlignment.afterAlignment2)
    }
  ];*/
  const rows = alignmentOnly
    ? alignmentRows
    : [...beforeAlignmentRow, ...alignmentRows, ...afterAlignmentRow];

  const handleOpen = () => {
    console.log("OPENING!");
    console.log(1);
    console.log(1);
    console.log(parsedBookAlignment);
    console.log(true);
    console.log("-----");
    setExpandViewData({
      bookNumber: 1,
      ms: 1,
      data: parsedBookAlignment,
    });
    console.log(expandViewData);
    setOpen(true);
    // setTimeout(() => {
    //   if (focusMilestone1.current && bookNumber === 1) {
    //     focusMilestone1.current.scrollIntoView(true);
    //   }
    //   if (focusMilestone2.current && bookNumber === 2) {
    //     focusMilestone2.current.scrollIntoView(true);
    //   }
    // }, 1000);
    console.log("EXITING. To books?");
  };

  const handleClose = () => setOpen(false);

  return (
    <TableContainer className="diffTableContainer">
      <ExpandView
        open={open}
        handleClose={handleClose}
        data={expandViewData}
        alignmentOnly={alignmentOnly}
      />
      <Table size="small" stickyHeader className="diffTable">
        <TableHead columns={columns} className="diffTableHeader">
          <TableRow className={"diffTableHeaderRow"}>
            {columns.map((col, colIndex) => (
              <TableCell
                className={"diffHeaderCell"}
                key={colIndex}
                align="center"
                style={{ width: "50%", background: "red !important" }}
              >
                {col.headerName}
                {console.log(col)}
                {!alignmentOnly && (
                  <Tooltip title="Expand View" placement="top">
                    <IconButton onClick={handleOpen} sx={{ ml: "10px" }}>
                      <i
                        className="fa-solid fa-expand"
                        style={{ fontSize: "12px" }}
                      ></i>
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            body: {
              borderBottom: "none",
            },
          }}
          className="diffTableBody"
        >
          <>
            <TableRow className={"diffTableRow"}>
              <NextMilestoneLoader
                alignmentOnly={alignmentOnly}
                displayMs={displayMs}
                setDisplayMs={setDisplayMs}
                bookNo={isFlipped ? 2 : 1}
                books={books}
                previous={true}
              />
              <NextMilestoneLoader
                alignmentOnly={alignmentOnly}
                displayMs={displayMs}
                setDisplayMs={setDisplayMs}
                bookNo={isFlipped ? 1 : 2}
                books={books}
                previous={true}
              />
            </TableRow>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex + 1} className={"diffTableRow"}>
                {columns.map((col) => (
                  <TableCell
                    key={`${rowIndex + 1}-${col.field}`}
                    dir="rtl"
                    align="right"
                    sx={{ verticalAlign: "top" }}
                    className={"diffTableCell"}
                    dangerouslySetInnerHTML={{
                      __html: row[col.field],
                    }}
                  ></TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className={"diffTableRow"}>
              <NextMilestoneLoader
                alignmentOnly={alignmentOnly}
                displayMs={displayMs}
                setDisplayMs={setDisplayMs}
                bookNo={isFlipped ? 2 : 1}
                books={books}
                previous={false}
              />
              <NextMilestoneLoader
                alignmentOnly={alignmentOnly}
                displayMs={displayMs}
                setDisplayMs={setDisplayMs}
                bookNo={isFlipped ? 1 : 2}
                books={books}
                previous={false}
              />
            </TableRow>
          </>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DiffGrid;
