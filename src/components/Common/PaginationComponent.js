import { TablePagination } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Context } from "../../App";

const PaginationComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalRecords, rowsPerPage, page } = useContext(Context);

  const handleChangePage = async (newPage) => {
    const params = Object.fromEntries([...searchParams]);
    setSearchParams({ ...params, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    const params = Object.fromEntries([...searchParams]);
    setSearchParams({ ...params, rowsPerPage: +event.target.value });
  };

  return (
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={totalRecords}
      rowsPerPage={rowsPerPage}
      page={page - 1}
      onPageChange={(e, pageNumber) => handleChangePage(pageNumber + 1)}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default PaginationComponent;
