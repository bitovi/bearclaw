import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { useMemo } from "react";

import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";
import type {
  AccountStatus,
  OrganizationMember,
} from "~/models/organizationUsers.server";
import { LinkPagination } from "~/components/table/LinkPagination";
import { useSorting } from "~/hooks/useSorting";
import { usePageCopy } from "~/routes/_dashboard/copy";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

interface HeadCell {
  disablePadding: boolean;
  id: keyof OrganizationMember;
  label: string;
  numeric: boolean;
  supportSort: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "User Name",
    supportSort: true,
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    supportSort: true,
  },
  {
    id: "accountStatus",
    numeric: false,
    disablePadding: false,
    label: "Account Status",
    supportSort: true,
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
    supportSort: false,
  },
];

const ChipColorStatus: Record<AccountStatus, Partial<ChipProps["color"]>> = {
  Active: "primary",
  Deleted: "error",
};

function isChipColorStatus(
  string: any
): string is keyof typeof ChipColorStatus {
  return typeof string === "string" && string in ChipColorStatus;
}

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const copy = usePageCopy("userManagement");
  const { onSelectAllClick, numSelected, rowCount } = props;
  const { sortQuery, currentSort } = useSorting();

  return (
    <TableHead>
      <TableRow sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          const active = Object.keys(currentSort).includes(headCell.id);
          return (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={currentSort?.[headCell.id] || false}
            >
              {headCell.supportSort ? (
                <TableSortLabel
                  active={active}
                  direction={currentSort?.[headCell.id] || "asc"}
                  onClick={() => sortQuery(headCell.id)}
                >
                  {copy?.content?.[`${"tableheader_" + headCell.id}`] ||
                    headCell.label}
                  {active ? (
                    <Box component="span" sx={visuallyHidden}>
                      {currentSort[headCell.id] === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                <>
                  {copy?.content?.[`${"tableheader_" + headCell.id}`] ||
                    headCell.label}
                </>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

const stringAvatar = (str: string) =>
  str
    .split(" ")
    .map((str) => str.charAt(0).toUpperCase())
    .join("");

export function UserTable({
  users,
  totalUsers,
  selected,
  setSelected,
}: {
  users: OrganizationMember[];
  totalUsers: number | null;
  selected: string[];
  setSelected: (users: string[]) => void;
}) {
  const nonOwnerUsers = useMemo(() => users.filter((n) => !n.owner), [users]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected: string[] = nonOwnerUsers.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    _event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    id: string
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={nonOwnerUsers.length}
            />
            <TableBody>
              {users.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={
                      row.owner
                        ? () => {}
                        : (
                            event: React.MouseEvent<
                              HTMLTableRowElement,
                              MouseEvent
                            >
                          ) => handleClick(event, row.id)
                    }
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <TableCell padding="checkbox">
                      {!row.owner && (
                        <Checkbox
                          disabled={row.owner}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      )}
                    </TableCell>
                    {Object.entries(row).map(([key, value], i) => {
                      if (key === "id" || key === "owner") return null;
                      if (i === 0) {
                        return (
                          <TableCell
                            key={key}
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            <Stack direction="row" alignItems="center" gap={1}>
                              <Avatar
                                sx={{
                                  backgroundColor: "rgba(72, 90, 255, 1)",
                                  color: "#FFF",
                                }}
                                component="span"
                              >
                                {stringAvatar(value.toString())}
                              </Avatar>
                              {value}
                            </Stack>
                          </TableCell>
                        );
                      }
                      if (key === "accountStatus" && isChipColorStatus(value)) {
                        return (
                          <TableCell align="left" key={key}>
                            <Chip
                              variant="outlined"
                              color={ChipColorStatus[value]}
                              label={value}
                            />
                          </TableCell>
                        );
                      }
                      return <TableCell key={key}>{value}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <LinkPagination totalItems={totalUsers || 0} />
      </Paper>
    </Box>
  );
}
