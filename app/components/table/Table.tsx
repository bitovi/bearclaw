import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Skeleton,
  Stack,
  TableSortLabel,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Link } from "../link";

import { NavigationFilter } from "./NavigationFilter";
import { LinkPagination } from "./LinkPagination";
import { useSorting } from "~/hooks/useSorting";
import { useTextCopy } from "~/hooks/useTextCopy";

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
  const CopyIcon = useTextCopy({
    copyValue: entry[linkKey],
    buttonProps: { sx: { color: "action.active" } },
  });

  return (
    <TableRow
      component={Link}
      to={`/history/${entry[linkKey]}`}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        textDecoration: "unset",
      }}
      role="row"
    >
      {Object.entries(entry).map(([field, fieldValue], i) => {
        let result = fieldValue;
        if (field.toLowerCase() === "@timestamp") {
          result = (
            <>
              <Typography variant="body2" color="text.primary">
                {fieldValue.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fieldValue.time}
              </Typography>
            </>
          );
        }
        if (i === 0) {
          return (
            <TableCell
              key={`${field}-${i}`}
              component={Box}
              scope="row"
              role="cell"
            >
              {result}
            </TableCell>
          );
        }
        return (
          <TableCell key={`${fieldValue}-${i}`} component={Box} role="cell">
            {field === linkKey ? (
              <Stack direction="row" alignItems="center">
                <Box
                  aria-label={fieldValue}
                  title={fieldValue}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100px",
                  }}
                >
                  {result}
                </Box>
                {CopyIcon}
              </Stack>
            ) : (
              <>{result}</>
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
      component={Box}
      role="columnheader"
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
        <Table sx={{ minWidth: 650 }} stickyHeader component={Box} role="table">
          <TableHead component={Box} role="rowgroup">
            <TableRow
              sx={{
                "& th": {
                  color: "text.secondary",
                },
              }}
              role="row"
              component={Box}
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
                    role="columnheader"
                    component={Box}
                  >
                    {header.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody component={Box} role="rowgroup">
            {tableData.map((entry, i) => {
              return linkKey ? (
                <TableRowLink linkKey={linkKey} key={i} entry={entry} />
              ) : (
                <TableRow
                  component={Box}
                  role="row"
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => onRowClick(entry)}
                >
                  {Object.entries(entry).map(([field, fieldValue], i) => {
                    if (i === 0) {
                      return (
                        <TableCell
                          component={Box}
                          key={`${field}-${i}`}
                          role="cell"
                          scope="row"
                        >
                          {fieldValue}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={`${fieldValue}-${i}`}
                        component={Box}
                        role="cell"
                      >
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
