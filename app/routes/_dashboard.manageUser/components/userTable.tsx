import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { useCallback, useMemo, useState } from "react";
import { TextInput } from "~/components/input";
import { Button } from "~/components/button";

import AddIcon from "@mui/icons-material/Add";
import { Chip, Stack } from "@mui/material";
import type { OrganizationMember } from "~/models/organizationUsers.server";
import { LinkPagination } from "~/components/table/LinkPagination";
import { useFiltering } from "~/hooks/useFiltering";
import { useSorting } from "~/hooks/useSorting";

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
    label: "User",
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
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;
  const { sortQuery, currentSort } = useSorting();

  return (
    <TableHead>
      <TableRow>
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
                  {headCell.label}
                  {active ? (
                    <Box component="span" sx={visuallyHidden}>
                      {currentSort[headCell.id] === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                <>{headCell.label}</>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({
  onHandleAddUser,
  onHandleRemoveUser,
}: {
  onHandleRemoveUser?: () => void;
  onHandleAddUser?: () => void;
}) {
  const { searchString, debounceFilterQuery } = useFiltering();

  return (
    <Toolbar
      sx={{
        pt: 2,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        flexDirection: {
          xs: "column",
          lg: "row",
        },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Organization Users
      </Typography>
      <Stack py={2} pr={2} gap={2} direction="row" alignItems="center">
        <TextInput
          name="search"
          label="Search"
          inputProps={{
            sx: { minWidth: "300px" },
          }}
          onChange={({ target }) =>
            debounceFilterQuery({ searchString: target.value, searchField: "" })
          }
          defaultValue={searchString}
          sx={{ minWidth: "200px" }}
        />
        {onHandleRemoveUser && (
          <Button
            variant={"buttonMedium"}
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.87)",
              height: "100%",
              maxHeight: "36px",
            }}
            onClick={onHandleRemoveUser}
            name="remove"
          >
            <Typography>Remove</Typography>
          </Button>
        )}
        {onHandleAddUser && (
          <Button
            variant={"contained"}
            sx={{
              height: "100%",
              maxHeight: "36px",
            }}
            onClick={onHandleAddUser}
            name="add"
          >
            <AddIcon />
            <Typography>New</Typography>
          </Button>
        )}
      </Stack>
    </Toolbar>
  );
}

export function UserTable({
  users,
  totalUsers,
  handleAddUser,
  handleRemoveUser,
}: {
  users: OrganizationMember[];
  totalUsers: number | null;
  handleRemoveUser?: (userIds: readonly string[]) => void;
  handleAddUser?: () => void;
}) {
  const [selected, setSelected] = useState<readonly string[]>([]);

  const nonOwnerUsers = useMemo(() => users.filter((n) => !n.owner), [users]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected: string[] = nonOwnerUsers.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

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

  const onHandleRemoveUser = useCallback(() => {
    handleRemoveUser && handleRemoveUser(selected);
  }, [handleRemoveUser, selected]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          onHandleAddUser={handleAddUser}
          onHandleRemoveUser={selected.length ? onHandleRemoveUser : undefined}
        />
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
                        : (event) => handleClick(event, row.id)
                    }
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
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
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">
                      <Chip label={row.accountStatus} />
                    </TableCell>
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
