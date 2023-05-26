import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TextInput } from "../input";
import { Link } from "../link";
import { copyText } from "./utils/copyText";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface TableProps<T> {
  tableData: Array<T> | undefined;
  tableTitle: string;
  headers: string[];
  tableContainerStyles?: SxProps<Theme>;
  search?: boolean;
  onRowClick?: (entry: T) => void;
  linkKey?: keyof T;
}

export const Search = ({
  onHandleChange,
  searchString,
}: {
  onHandleChange: (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  searchString: string;
}) => {
  return (
    <Toolbar sx={{ justifyContent: "flex-end" }}>
      <TextInput
        name="search"
        inputProps={{
          sx: { maxHeight: "20px", minWidth: "300px" },
        }}
        onChange={onHandleChange}
        placeholder="Search"
        value={searchString}
        sx={{ minWidth: "200px" }}
      />
      <IconButton>
        <FilterListIcon />
      </IconButton>
    </Toolbar>
  );
};

function TableRowLink<T>({
  entry,
  linkKey,
}: {
  entry: T extends Record<string, any> ? T : never;
  linkKey: keyof T;
}) {
  const [textCopied, setTextCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (textCopied) {
      timer = setTimeout(() => {
        setTextCopied(false);
      }, 500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [textCopied]);

  return (
    <TableRow
      component={Link}
      to={`./${entry[linkKey]}`}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        textDecoration: "unset",
      }}
    >
      {Object.entries(entry).map(([field, fieldValue], i) => {
        if (i === 0) {
          return (
            <TableCell key={`${field}-${i}`} component="th" scope="row">
              {fieldValue}
            </TableCell>
          );
        }
        return (
          <TableCell key={`${fieldValue}-${i}`}>
            {field === linkKey ? (
              <Stack direction="row" alignItems="center">
                <Box
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100px",
                  }}
                >
                  {fieldValue}
                </Box>

                <IconButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTextCopied(true);
                    copyText(fieldValue);
                  }}
                >
                  {textCopied ? (
                    <CheckCircleIcon data-testid="copy-success-icon" />
                  ) : (
                    <ContentCopyIcon data-testid="copy-icon" />
                  )}
                </IconButton>
              </Stack>
            ) : (
              <>{fieldValue}</>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export default function InvoiceTable<T>({
  tableData = [],
  tableTitle,
  headers = [],
  tableContainerStyles = {},
  search,
  onRowClick = () => {},
  linkKey,
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

  const handleSearch = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchString(ev.target.value);
    },
    []
  );

  const filteredTabledEntries = useMemo(() => {
    if (!searchString) return tableData;

    return tableData.filter((entry) => {
      let result = false;
      for (const key in entry) {
        if (entry[key].toLowerCase().includes(searchString)) result = true;
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
        <Typography variant="h6" color="text.primary" data-testid="table-title">
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
              return linkKey ? (
                <TableRowLink linkKey={linkKey} key={i} entry={entry} />
              ) : (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => onRowClick(entry)}
                >
                  {Object.entries(entry).map(([field, fieldValue], i) => {
                    if (i === 0) {
                      return (
                        <TableCell
                          key={`${field}-${i}`}
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
