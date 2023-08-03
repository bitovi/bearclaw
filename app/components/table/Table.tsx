import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import type { SxProps, Theme } from "@mui/material";
import { Link } from "../link";
import { LinkPagination } from "./LinkPagination";
import { useSorting } from "~/hooks/useSorting";
import { useLocation, useNavigation } from "@remix-run/react";
import type { ButtonProps } from "@mui/material/Button";

type LinkIconProps = {
  copyValue?: string;
  buttonProps?: ButtonProps;
};
interface TableProps<T> {
  tableData: Array<T> | undefined;
  tableTitle?: string;
  headers: { label: string; value: string; sortable: boolean }[];
  tableContainerStyles?: SxProps<Theme>;
  sortableFields?: Array<keyof T>;
  onRowClick?: (entry: T) => void;
  linkKey?: keyof T;
  linkIcon?: (props: LinkIconProps) => JSX.Element;
  totalItems?: number;
  linkBasePath?: string;
}

function SkeletonBody({ rows, columns }: { rows: number; columns: number }) {
  return (
    <TableBody component={Box} role="rowgroup">
      {Array(rows)
        .fill("")
        .map((_, row) => {
          return (
            <TableRow
              key={row}
              component={Box}
              role="row"
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {Array(columns)
                .fill("")
                .map((_, column) => (
                  <TableCell
                    key={column}
                    component={Box}
                    sx={{ width: "200px", height: "73px" }}
                    role="cell"
                  >
                    <Skeleton animation="wave" variant="text" />
                  </TableCell>
                ))}
            </TableRow>
          );
        })}
    </TableBody>
  );
}

export function SkeletonTable({
  tableTitle,
  tableContainerStyles,
  headers,
  rows = 5,
}: {
  tableTitle?: string;
  tableContainerStyles?: SxProps<Theme>;
  headers: string[];
  rows?: number;
}) {
  return (
    <Paper sx={{ mb: 2 }}>
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
              {headers.map((str, i) => {
                return (
                  <TableCell
                    role="columnheader"
                    component={Box}
                    sx={{ fontColor: "text.secondary" }}
                    key={`str-${i}`}
                  >
                    {str}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <SkeletonBody rows={rows} columns={headers.length} />
        </Table>
      </TableContainer>
    </Paper>
  );
}

function TableRowLink<T>({
  entry,
  linkKey,
  linkIcon,
  linkBasePath: _linkBasePath,
}: {
  entry: T extends Record<string, any> ? T : never;
  linkKey: keyof T;
  linkIcon: TableProps<T>["linkIcon"];
  linkBasePath?: string;
}) {
  const linkBasePath = _linkBasePath
    ? _linkBasePath.charAt(0) === "/"
      ? _linkBasePath
      : "/" + _linkBasePath
    : undefined;
  const directTo = linkBasePath
    ? `${linkBasePath}/${entry[linkKey]}`
    : `${entry[linkKey]}`;
  return (
    <TableRow
      component={Link}
      to={directTo}
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
              sx={{
                width: "200px",
                minHeight: "73px",
                wordBreak: "break-word",
              }}
            >
              {result}
            </TableCell>
          );
        }
        return (
          <TableCell
            key={`${fieldValue}-${i}`}
            component={Box}
            role="cell"
            sx={{ width: "200px", minHeight: "73px" }}
          >
            {field === linkKey ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent={"space-between"}
              >
                <Tooltip
                  title={fieldValue}
                  key={`tooltip-${fieldValue}-${i}`}
                  placement="top"
                  arrow
                >
                  <Box
                    aria-label={fieldValue}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100px",
                    }}
                  >
                    {result}
                  </Box>
                </Tooltip>
                {linkIcon &&
                  linkIcon({
                    copyValue: entry[linkKey],
                    buttonProps: { sx: { color: "action.active" } },
                  })}
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
  onRowClick,
  linkKey,
  totalItems,
  linkIcon,
  linkBasePath,
}: TableProps<T extends Record<string, any> ? T : never>) {
  const { currentSort, sortQuery } = useSorting();
  const { pathname } = useLocation();
  const { location, state } = useNavigation();
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
          {/* If we're updating our search parameters, trigger a loading state in the table body */}
          {state === "loading" && location?.pathname === pathname ? (
            <SkeletonBody rows={5} columns={headers.length} />
          ) : (
            <TableBody component={Box} role="rowgroup">
              {tableData.map((entry, i) => {
                return linkKey ? (
                  <TableRowLink
                    linkKey={linkKey}
                    key={i}
                    entry={entry}
                    linkIcon={linkIcon}
                    linkBasePath={linkBasePath}
                  />
                ) : (
                  <TableRow
                    component={Box}
                    role="row"
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    onClick={() => onRowClick?.(entry)}
                  >
                    {Object.entries(entry).map(([field, fieldValue], i) => {
                      if (i === 0) {
                        return (
                          <TableCell
                            component={Box}
                            key={`${field}-${i}`}
                            role="cell"
                            sx={{
                              width: "200px",
                              minHeight: "73px",
                              wordBreak: "break-word",
                            }}
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
                          sx={{ width: "200px", minHeight: "73px" }}
                        >
                          {fieldValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {!!totalItems && <LinkPagination totalItems={totalItems} />}
    </Paper>
  );
}
