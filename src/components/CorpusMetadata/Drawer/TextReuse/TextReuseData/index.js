import React, { useContext } from "react";
import { downloadCsvData } from "../../../../../services/TextReuseData";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../../App";
import { getMetadataObject } from "../../../../../functions/getMetadataObject";
import { setPairwiseVizData } from "../../../../../functions/setVisualizationData";
import { setInitialValues } from "../../../../../functions/setInitialValues";
import { getVersionMeta } from "../../../../../functions/getVersionMeta";
import {
  lightSrtFolders,
  srtFoldersGitHub,
} from "../../../../../assets/srtFolders";
import TextReuseTable from "./TextReuseTable";

// Text Reuse Data tab in the drawer:
const TextReuseData = ({ fullData, query }) => {
  const navigate = useNavigate();
  const {
    setMetaData,
    setChartData,
    setLoadedCsvFile,
    dataLoading,
    setDataLoading,
    setBooks,
    setIsOpenDrawer,
    releaseCode,
    setIsFileUploaded,
    setBooksAlignment,
    setIsError,
    setUrl,
  } = useContext(Context);

  // redirect to chart page
  const handleRedirectedToChart = async (value) => {
    setInitialValues({
      dataLoading,
      setIsFileUploaded,
      setDataLoading,
      setMetaData,
      setChartData,
      setBooksAlignment,
      setBooks,
    });

    // generate csv file name
    const csvFileName = value.tsv_url.split("/").pop();

    // get book names
    const book_names = csvFileName.split("_");

    if (book_names[0] && book_names[1]) {
      // download pairwise text reuse data filename:
      const versionMeta = await getVersionMeta(releaseCode, book_names);
      const book1 = versionMeta.book1;
      const book2 = versionMeta.book2;
      // First try to download from KITAB webserver:
      let passim_folder = lightSrtFolders[releaseCode];
      let url = `${passim_folder}/${book_names[0]}/${csvFileName}`;
      let CSVFile = await downloadCsvData(url);
      // if this fails: try to download from GitHub:
      if (CSVFile instanceof Error) {
        passim_folder = srtFoldersGitHub[releaseCode];
        url = `${passim_folder}/${book_names[0]}/${csvFileName}`;
        CSVFile = await downloadCsvData(url);
      }

      // store the loaded csv file in memory (context):
      setLoadedCsvFile(CSVFile);

      // load pairwise visualisation:
      setPairwiseVizData({
        book1,
        book2,
        CSVFile,
        dataLoading,
        setDataLoading,
        setMetaData,
        releaseCode,
        getMetadataObject,
        setChartData,
        setIsError,
        setIsFileUploaded,
        navigate,
        csvFileName,
        setUrl,
      });
    } else {
      setDataLoading({ ...dataLoading, uploading: false });
      setIsError(true);
    }
    setIsOpenDrawer(false);
  };

  return (
    <TextReuseTable
      fullData={fullData}
      query={query}
      handleRedirectedToChart={handleRedirectedToChart}
    />
  );
};

export default TextReuseData;
