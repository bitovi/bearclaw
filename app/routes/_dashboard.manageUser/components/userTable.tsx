import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
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
import { Stack } from "@mui/material";
import type { OrganizationMember } from "~/models/organizationUsers.server";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | null },
  b: { [key in Key]: number | string | null }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof OrganizationMember;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "User",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "accountStatus",
    numeric: false,
    disablePadding: false,
    label: "Account Status",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof OrganizationMember
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof OrganizationMember) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

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
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({
  onHandleChange,
  searchString,
  onHandleAddUser,
  onHandleRemoveUser,
}: {
  onHandleChange: (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  searchString: string | undefined;
  onHandleRemoveUser?: () => void;
  onHandleAddUser?: () => void;
}) {
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
          inputProps={{
            sx: { minWidth: "300px" },
          }}
          onChange={onHandleChange}
          placeholder="Search"
          value={searchString}
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
  handleAddUser,
  handleRemoveUser,
}: {
  users: OrganizationMember[];
  handleRemoveUser?: (userIds: readonly string[]) => void;
  handleAddUser?: (userIds: readonly string[]) => void;
}) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof OrganizationMember>("name");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchString, setSearchString] = useState("");

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof OrganizationMember
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected: string[] = users.map((n) => n.id);
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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredTabledEntries = useMemo(() => {
    if (!searchString) return users;

    return users.filter((entry) => {
      let result = false;
      for (const key in entry) {
        if (
          // Typescript won't believe the keys are associated with the ones specified in the object type
          (entry[key as keyof OrganizationMember] || "")
            .toLowerCase()
            .includes(searchString)
        ) {
          result = true;
        }
      }
      return result;
    });
  }, [searchString, users]);

  const visibleRows = useMemo(
    () =>
      stableSort<OrganizationMember>(
        filteredTabledEntries,
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredTabledEntries]
  );

  const onHandleAddUser = useCallback(() => {
    handleAddUser && handleAddUser(selected);
  }, [handleAddUser, selected]);

  const onHandleRemoveUser = useCallback(() => {
    handleRemoveUser && handleRemoveUser(selected);
  }, [handleRemoveUser, selected]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          onHandleAddUser={onHandleAddUser}
          onHandleRemoveUser={onHandleRemoveUser}
          onHandleChange={handleSearch}
          searchString={searchString}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
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
                    {/* <TableCell align="left">{row.label}</TableCell> */}
                    <TableCell align="left">{row.accountStatus}</TableCell>
                    {/* <TableCell align="left">{row.label2}</TableCell> */}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTabledEntries.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
