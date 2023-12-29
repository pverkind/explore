import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { Context } from "../../../App";
import * as d3 from "d3";
import SectionHeaderLayout from "../SectionHeader/SectionHeaderLayout";
import VisualizationHeader from "../SectionHeader/VisualizationHeader";
import ScatterPlot from "./ScatterPlot";
import BottomBar from "./BottomBar";
import SideBar from "./SideBar";
import MultiFilter from "./MultiFilter";

const MultiVisual = (props) => {
  console.log("RENDERING MULTI CHART");

  // set the dimensions and margins of the graph

  var margin = { top: 10, right: 30, bottom: 20, left: 60 };
  var width = 1000 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  const {
    metaData,
    chartData,
    setXScale,
    setYScale,
    colorScale,
    //setChartData,
    /*Books,
    setBooks,
    bookSectionRef,
    focusMilestone1,
    focusMilestone2,
    setBooksAlignment,
    isFlipped,
    dataLoading,
    setDataLoading,
    setFocusedDataIndex,
    setDisplayMs,
    focusedDataIndex,
    setFlipTimeLoading,*/
    //colors,
    //setColors
  } = useContext(Context);

  const book1 = metaData.book1;
  const mainBookURI = book1.bookTitle.path;

  const downloadFileName = `${book1?.versionCode}_all.png`;

  /*const infernoReversed = [
    "#fcffa4",
    "#f7d13d",
    "#fb9b06",
    "#ed6925",
    "#cf4446",
    "#a52c60",
    "#781c6d",
    "#4a0c6b",
    "#1b0c41",
    "#000004"
  ];*/

  // extract relevant objects from chartData:
  let {
    versionCode,
    tokens,
    msData,
    msStats,
    //msBooks,
    bookStats,
    //bookIndexDict,
    bookUriDict,
  } = chartData;

  const [dateRange, setDateRange] = useState([0, 1500]);
  let maxbc = Math.max(...bookStats.map((d) => d.ch_match));
  const [bookCharRange, setBookCharRange] = useState([1, maxbc]);
  let maxalign = Math.max(...bookStats.map((d) => d.alignments));
  const [bookAlignRange, setBookAlignRange] = useState([1, maxalign]);
  let maxmschars = Math.max(...msData.map((d) => d.ch_match));
  const [msCharsRange, setMsCharsRange] = useState([1, maxmschars]);

  // FILTER DATA:

  // filter by date:
  let [minDate, maxDate] = dateRange;
  let [minBookChars, maxBookChars] = bookCharRange;
  let [minAlignments, maxAlignments] = bookAlignRange;
  let [minMsChars, maxMsChars] = msCharsRange;

  msData = msData.filter((d) => {
    return (
      d.date >= minDate &&
      d.date <= maxDate &&
      d.ch_match <= maxMsChars &&
      d.ch_match >= minMsChars
    );
  });
  bookStats = bookStats.filter((d) => {
    return (
      d.date >= minDate &&
      d.date <= maxDate &&
      d.ch_match >= minBookChars &&
      d.ch_match <= maxBookChars &&
      d.alignments >= minAlignments &&
      d.alignments <= maxAlignments
    );
  });

  // recalculate msStats?!

  const restoreCanvas = () => {
    // reload without filter search params
    //setSearchParams((prev) => ({books: prev.books}))
    console.log("TO DO: restore canvas");
  };

  const mainBookMilestones = Math.ceil(tokens.first / 300);

  // build variables needed to create axes:
  /*const maxChMatch = msData.reduce(
    (a,b) => a.ch_match > b.ch_match ? a : b
    ).ch_match;
  const minChMatch = msData.reduce(
    (a,b) => a.ch_match < b.ch_match ? a : b
    ).ch_match;*/
  const [minChMatch, maxChMatch] = d3.extent(msData, (d) => d.ch_match);
  console.log("maxChMatch: " + maxChMatch);

  let dotSize = Math.min(
    Math.ceil(width / bookStats.length / 2),
    Math.ceil(height / mainBookMilestones / 2),
    5
  );

  const [toggle, setToggle] = useState(false);

  return (
    <>
      <SectionHeaderLayout
        item={{
          title: "One-to-Many Visualization",
          icon: "fa-solid fa-chart-column",
        }}
        toggle={toggle}
        setToggle={setToggle}
      >
        <VisualizationHeader
          restoreCanvas={restoreCanvas}
          isPairwiseViz={props.isPairwiseViz}
          downloadFileName={downloadFileName}
          colorScale={colorScale}
          width={width}
        />
      </SectionHeaderLayout>

      <Box
        id="multiVis"
        sx={{
          px: {
            xs: "0px",
            sm: "30px",
          },
        }}
      >
        <>
          <div
            id={"upperContainer"}
            style={{
              overflow: "hidden",
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ float: "left" }}>
              <ScatterPlot
                mainBookMilestones={mainBookMilestones}
                mainBookURI={mainBookURI}
                versionCode={versionCode}
                bookStats={bookStats}
                msdata={msData}
                maxChMatch={maxChMatch}
                minChMatch={minChMatch}
                margin={margin}
                width={width}
                height={height}
                dotSize={dotSize}
                bookUriDict={bookUriDict}
                setXScale={setXScale}
                setYScale={setYScale}
              />
            </div>
            <div
              style={{
                float: "right",
                position: "absolute",
                left: `${width + margin.left + margin.right + 20}px`,
              }}
            >
              <SideBar
                mainBookMilestones={mainBookMilestones}
                msStats={msStats}
                width={100}
                height={height}
                margin={margin}
              />
            </div>
          </div>
          <BottomBar
            margin={{ top: 0, right: 30, bottom: 30, left: 60 }}
            width={width}
            height={100}
            bookStats={bookStats}
            mainBookURI={mainBookURI}
            dateRange={dateRange}
          />
        </>
        <div className={"vizTooltip"} sx={{ style: "opacity: 0" }} />
      </Box>
      <MultiFilter
        dateRange={dateRange}
        setDateRange={setDateRange}
        bookCharRange={bookCharRange}
        setBookCharRange={setBookCharRange}
        bookAlignRange={bookAlignRange}
        setBookAlignRange={setBookAlignRange}
        msCharsRange={msCharsRange}
        setMsCharsRange={setMsCharsRange}
      />
    </>
  );
};

export default MultiVisual;
