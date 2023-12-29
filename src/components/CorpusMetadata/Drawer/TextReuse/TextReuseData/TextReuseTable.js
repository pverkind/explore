import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Tooltip } from "@mui/material";
import { TablePagination } from "@mui/material";
import React, { useContext } from "react";
import TableHeader from "./TableHeader";
import { useState } from "react";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { getAllPairwiseData } from "../../../../../services/CorpusMetaData";
import { Context } from "../../../../../App";

const TextReuseTable = ({ fullData, query, handleRedirectedToChart }) => {
  const { dataLoading } = useContext(Context);
  const [sortingOrder, setSortingOrder] = useState("-instances_count");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
  };

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

  // Inside your component
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setIsLoading(true);
    const releaseCode = localStorage.getItem("release_code");
    let isMounted = true; // Add a flag to track if the component is still mounted

    const fetchData = async () => {
      try {
        const res = await getAllPairwiseData(
          JSON.parse(releaseCode),
          fullData?.version_uri,
          sortingOrder,
          debouncedQuery,
          page
        );

        if (isMounted) {
          setTotal(res.count);
          setData(res.results);
          setIsLoading(false);
        }
      } catch (error) {
        // Handle any errors here
        setTotal(0);
        setData([]);
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel any ongoing tasks when the component unmounts
    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
    };
  }, [sortingOrder, fullData, debouncedQuery, page, query]);

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
          <>
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
                    width={"30%"}
                    padding={"0px 15px"}
                    sx={{
                      wordWrap: "break-word",
                      float: "left",
                      fontSize: "14px",
                      wordBreak: "break-all",
                    }}
                  >
                    {item.book2?.author_lat_prefered}
                  </Typography>
                  <Typography
                    width={"50%"}
                    padding={"0px 15px"}
                    sx={{
                      wordWrap: "break-word",
                      float: "left",
                      fontSize: "14px",
                      wordBreak: "break-all",
                    }}
                  >
                    {item?.book2?.title_lat_prefered}
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
                    {item?.instances_count}
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
                          onClick={() => handleRedirectedToChart(item)}
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
                        <a
                          href={item.tsv_url.replace("http://", "https://")}
                          style={{
                            background: "none",
                            border: "0px",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#7593af",
                          }}
                        >
                          <i className="fa-solid fa-file-csv"></i>
                        </a>
                      </Typography>
                    </Tooltip>
                  </Box>
                </Box>
              ))
            )}
          </>
        )}
      </Box>
      {data.length !== 0 && (
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          onPageChange={(e, pageNumber) => handlePageChange(pageNumber)}
          onRowsPerPageChange={(e) => handleRowsPerPageChange(e)}
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          sx={{ float: "right" }}
        />
      )}
    </Box>
  );
};

export default TextReuseTable;
