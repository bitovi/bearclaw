import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  TableSortLabel,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Link } from "../link";
import { copyText } from "./utils/copyText";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { NavigationFilter } from "./NavigationFilter";
import { LinkPagination } from "./LinkPagination";
import { useSorting } from "~/hooks/useSorting";

export type DropdownOption = {
  value: string;
  label: string;
};
interface TableProps<T> {
  tableData: Array<T> | undefined;
  tableTitle: string;
  headers: { label: string; value: string; sortable: boolean }[];
  tableContainerStyles?: SxProps<Theme>;
  search?: boolean;
  sortableFields?: Array<keyof T>;
  onRowClick?: (entry: T) => void;
  linkKey?: keyof T;
  searchFields?: DropdownOption[];
  totalItems?: number;
}

export function SkeletonTable({
  search,
  searchFields,
  tableTitle,
  tableContainerStyles,
  headers,
}: {
  search?: boolean;
  searchFields?: DropdownOption[];
  tableTitle?: string;
  tableContainerStyles?: SxProps<Theme>;
  headers: string[];
}) {
  return (
    <Paper sx={{ mb: 2 }}>
      <Box padding={2}>
        <Typography variant="h6" color="text.primary" data-testid="table-title">
          {tableTitle}
        </Typography>
      </Box>
      {search && searchFields && (
        <NavigationFilter
          dropdownLabel="Type"
          dropdownOptions={searchFields}
          searchLabel="Search"
        />
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
            {headers.map((row) => {
              return (
                <TableRow key={row}>
                  <TableCell component="th" scope="row">
                    <Skeleton animation="wave" variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" variant="text" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

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

  // TODO -- resolve validateDOMNesting error re: <a/>'s being children of <tbody>
  return (
    <TableRow
      component={Link}
      to={`/history/${entry[linkKey]}`}
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
                  aria-label="copy to clipboard"
                  title="Copy to clipboard"
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

function HeaderSortCell({
  headCell,
  sortDirection,
  active,
  direction,
  onClick,
}: {
  headCell: { value: string; label: string; sortable: boolean };
  sortDirection: "asc" | "desc" | false;
  active: boolean;
  direction: "asc" | "desc" | undefined;
  onClick: () => void;
}) {
  return (
    <TableCell
      key={headCell.value}
      align={"left"}
      padding={"normal"}
      sortDirection={sortDirection}
      sx={{ fontColor: "text.secondary" }}
    >
      <TableSortLabel active={active} direction={direction} onClick={onClick}>
        {headCell.label}
      </TableSortLabel>
    </TableCell>
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
  searchFields,
  totalItems,
}: TableProps<T extends Record<string, any> ? T : never>) {
  const { currentSort, sortQuery } = useSorting();
  return (
    <Paper sx={{ mb: 2 }} data-testid={`${tableTitle}-table`}>
      {tableTitle && (
        <Box padding={2}>
          <Typography
            variant="h6"
            color="text.primary"
            data-testid="table-title"
          >
            {tableTitle}
          </Typography>
        </Box>
      )}
      {search && searchFields && (
        <NavigationFilter
          dropdownLabel="Type"
          dropdownOptions={searchFields}
          searchLabel="Search"
        />
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
              {headers.map((header, i) => {
                if (header.sortable) {
                  const active = Object.keys(currentSort).includes(
                    header.value
                  );
                  return (
                    <HeaderSortCell
                      key={`str-${i}`}
                      active={active}
                      headCell={header}
                      sortDirection={currentSort?.[header.value] || false}
                      onClick={() => sortQuery(header.value)}
                      direction={currentSort?.[header.value] || "asc"}
                    />
                  );
                }
                return (
                  <TableCell
                    sx={{ fontColor: "text.secondary" }}
                    key={`str-${i}`}
                  >
                    {header.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((entry, i) => {
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
      {!!totalItems && <LinkPagination totalItems={totalItems} />}
    </Paper>
  );
}
