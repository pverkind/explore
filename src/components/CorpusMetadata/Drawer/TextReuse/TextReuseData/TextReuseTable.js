import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Tooltip } from "@mui/material";
import { IconButton } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import TableHeader from "./TableHeader";
import { CircularProgress } from "@mui/material";
// import { getAllPairwiseData } from "../../../../../services/CorpusMetaData";
import { getVersionMetadataById } from "../../../../../services/CorpusMetaData";
import {  getOneBookReuseStats } from "../../../../../services/TextReuseData";
import { Context } from "../../../../../App";
import { buildPairwiseCsvURL } from "../../../../../utility/Helper";
import Papa from "papaparse";


const TextReuseTable = ({ fullData, query, handleRedirectedToChart }) => { 
  const { dataLoading } = useContext(Context);
  const [sortingOrder, setSortingOrder] = useState("-instances_count");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  /**
   * Download a csv file containing the text reuse data
   * 
   * @param {Object} b1Metadata full metadata of book1
   * @param {Object} b2Data summary metadata of book2
   */
  const downloadPairwiseCsv = async (b1Metadata, book2Data) => {
    // we already have full metadata of book1:
    // download the metadata for book 2 and get the ID:
    const releaseCode = JSON.parse(localStorage.getItem("release_code"));
    const b2Metadata = await getVersionMetadataById(releaseCode, book2Data.id);
    // build the URL to the CSV file:
    const csvUrl = await buildPairwiseCsvURL(releaseCode, b1Metadata, b2Metadata);
    const csvFilename = csvUrl.split("/").pop();
    // create a temporary link to the csv file to trigger the download:
    const link = document.createElement('a');
    link.href = csvUrl;
    link.setAttribute('download', csvFilename); 
    document.body.appendChild(link);
    // download and clean up:
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Open the pairwise visualization
   * 
   * @param {Object} b1Metadata full metadata of book1
   * @param {Object} b2Data summary metadata of book2
   * @param {Function} handleRedirectedToChart 
   */
  const openViz = async (b1Metadata, b2Data, handleRedirectedToChart) => {
    // we already have full metadata of book1;
    // download the metadata for book 2 and get the ID:
    const releaseCode = JSON.parse(localStorage.getItem("release_code"));
    const b2Metadata = await getVersionMetadataById(releaseCode, b2Data.id);
    // build the URL to the CSV file:
    const csvUrl = await buildPairwiseCsvURL(releaseCode, b1Metadata, b2Metadata);
    b2Data.tsv_url = csvUrl;
    handleRedirectedToChart(b2Data);
  }


  // debounce function for search query:
  // make sure the query is not changed after every key stroke:
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  // get the query from the search box with a delay of 300 ms:
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // don't run this code if the book1 metadata is not yet loaded
    if (!fullData || !fullData.version_uri) return;

    setIsLoading(true);
    const releaseCode = localStorage.getItem("release_code");

    /**
     * Get the text reuse statistics for book1 from GitHub and parse it.
     * 
     * @returns {Promise<Object[]>} A promise that resolves to a list of reuse statistics objects.
     * Each object contains:
     *   - {string} id: Book 2's version ID (without language or extension)
     *   - {string} book: Book 2's book URI (date+author+title)
     *   - {number} alignments: Number of reuse alignments with the primary book
     *   - {number} ch_match: Number of matched characters in alignments between Book1 and Book2>
     */
    const fetchData = async () => {
      const versionID = fullData?.version_uri?.split(".").pop();
      const statsFile = await getOneBookReuseStats(
        JSON.parse(releaseCode),
        versionID
      );
      // parse the statsFile csv:
      Papa.parse(statsFile, {
        header: true,
        dynamicTyping: true, // should convert numeric fields to integers
        skipEmptyLines: true,
        complete: (result) => {
          let statsData = result.data;
          let filtered;
          // filter the data based on the user's search query:
          if (query) {
             filtered = statsData.filter(d => d.book.includes(query));
          } else {
            filtered = statsData;
          }
          // sort the data based on the user's request 
          // (default= number of alignments, descending):
          if (sortingOrder === "instances_count"){
            filtered.sort((a, b) => a.alignments - b.alignments);
          } else if (sortingOrder === "book") {
            filtered.sort((a, b) => a.book.localeCompare(b.book));
          } else if (sortingOrder === "-book") {
            filtered.sort((a, b) => b.book.localeCompare(a.book));
          } else {
            filtered.sort((a, b) => b.alignments - a.alignments);
          }
          // set Context variables:
          setTotal(statsData.length);
          setData(filtered);
          setIsLoading(false);
        }
      });
    };
    
    fetchData();

  }, [sortingOrder, fullData, debouncedQuery, query]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ float: "left", width: "100%" }}>
        <TableHeader
          sortingOrder={sortingOrder}
          setSortingOrder={setSortingOrder}
        />

        {isLoading || dataLoading?.uploading ? (
          <Box
            sx={{
              width: "100%",
              height: "200px",
              float: "left",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            float: "left", 
            width: "100%", 
            maxHeight: "30vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: 'column',
          }}>
            {data.length === 0 ? (
              <Box
                display={"flex"}
                justifyContent={"center"}
                py={"20px"}
                pt={"40px"}
                width={"100%"}
              >
                <Typography variant="h4">
                  No Text Text Reuse Statistics Available
                </Typography>
                <Typography variant="h6">
                  Select two texts in the metadata table to visualize text reuse
                </Typography>
              </Box>
            ) : (
              data.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0px",
                    padding: "8px 0px",
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    float: "left",
                  }}
                >
                  <Typography
                    width={"80%"}
                    padding={"0px 15px"}
                    sx={{
                      wordWrap: "break-word",
                      float: "left",
                      fontSize: "14px",
                      wordBreak: "break-all",
                    }}
                  >
                    {item.book}
                  </Typography>
                  <Typography
                    width={"20%"}
                    padding={"0px 15px"}
                    textAlign={"center"}
                    sx={{
                      wordWrap: "break-word",
                      fontSize: "14px",
                      wordBreak: "break-all",
                    }}
                  >
                    {item?.alignments}
                  </Typography>
                  <Box
                    width={"10%"}
                    padding={"0px 15px"}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Tooltip placement="top" title={"Visualization"}>
                      <Typography>
                        <button
                          onClick={() => openViz(
                            fullData, 
                            item, 
                            handleRedirectedToChart
                          )}
                          style={{
                            background: "none",
                            border: "0px",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#7593af",
                            marginRight: "8px",
                          }}
                        >
                          <i className="fa-solid fa-barcode"></i>
                        </button>
                      </Typography>
                    </Tooltip>

                    <Tooltip placement="top" title={"Download CSV"}>
                      <Typography>
                        <IconButton
                          sx={{
                            background: "none",
                            border: "0px",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#7593af",
                          }}
                          onClick={() => downloadPairwiseCsv(fullData, item)}
                        >
                          <i className="fa-solid fa-file-csv"></i>
                        </IconButton>

                      </Typography>
                    </Tooltip>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "2px",
          display: "flex",
          alignItems: "center",
          margin: "5px 0px",
          padding: "8px 0px",
          bgcolor: "#7593af",
          color: "white",
          borderRadius: "5px",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          float: "left",
          boxShadow: '2px 4px 8px rgba(0,0,0,0.2)'
        }}
      ></Box>
      {data.length !== 0 && (
        <Typography>{`Number of results: ${data.length} / ${total}`}</Typography>
      )}
    </Box>
  );
};

export default TextReuseTable;
