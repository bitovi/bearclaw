import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import React, { useMemo, useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TextInput } from "../input";

interface TableProps<T> {
  tableData: Array<T> | undefined;
  tableTitle: string;
  headers: string[];
  tableContainerStyles?: SxProps<Theme>;
  search?: boolean;
  onRowClick?: (entry: T) => void;
}

const Search = ({
  onHandleChange,
  searchString,
}: {
  onHandleChange: (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  searchString: string;
}) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent={"flex-end"}>
      <Stack direction={"row"} width="30%">
        <TextInput
          name="search"
          inputProps={{
            sx: { maxHeight: "20px" },
          }}
          onChange={onHandleChange}
          placeholder="Search"
          fullWidth
          value={searchString}
        />
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default function InvoiceTable<T>({
  tableData = [],
  tableTitle,
  headers = [],
  tableContainerStyles = {},
  search,
  onRowClick = () => {},
}: TableProps<T extends Record<string, any> ? T : never>) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(0);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchString(ev.target.value);
  };

  const filteredTabledEntries = useMemo(() => {
    if (!searchString) return tableData;

    return tableData.filter((entry) => {
      let result = false;
      for (const key in entry) {
        if (entry[key].includes(searchString)) result = true;
      }
      return result;
    });
  }, [searchString, tableData]);

  const tableEntries = useMemo(() => {
    return filteredTabledEntries.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, filteredTabledEntries]);

  return (
    <Paper sx={{ mb: 2 }}>
      <Box padding={2}>
        <Typography variant="h6" color="text.primary">
          {tableTitle}
        </Typography>
      </Box>
      {search && (
        <Search onHandleChange={handleSearch} searchString={searchString} />
      )}
      <TableContainer sx={tableContainerStyles}>
        <Table sx={{ minWidth: 650 }} stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  color: "text.secondary",
                },
              }}
            >
              {headers.map((str, i) => {
                return (
                  <TableCell
                    sx={{ fontColor: "text.secondary" }}
                    key={`str-${i}`}
                  >
                    {str}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableEntries.map((entry, i) => {
              return (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => onRowClick(entry)}
                >
                  {Object.entries(entry).map(([_field, fieldValue], i) => {
                    if (i === 0) {
                      return (
                        <TableCell
                          key={`${fieldValue}-${i}`}
                          component="th"
                          scope="row"
                        >
                          {fieldValue}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={`${fieldValue}-${i}`}>
                        {fieldValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTabledEntries?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
