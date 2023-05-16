import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { useMemo, useState } from "react";
import type { InvoiceHistoryItem } from "~/models/subscriptionTypes";
import { Box, Typography } from "@mui/material";

type InvoiceTableProps = {
  invoiceEntries: InvoiceHistoryItem[];
};

export default function InvoiceTable({ invoiceEntries }: InvoiceTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  const tableHeaders = useMemo(() => {
    return invoiceEntries[0]
      ? Object.keys(invoiceEntries[0]).map((str) => str.replace("_", " "))
      : [];
  }, [invoiceEntries]);

  const tableEntries = useMemo(() => {
    return invoiceEntries.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, invoiceEntries]);

  return (
    <Paper sx={{ mb: 2 }}>
      <Box padding={2}>
        <Typography variant="h6" color="text.primary">
          Invoice
        </Typography>
      </Box>
      <TableContainer sx={{ maxHeight: "400px" }}>
        <Table sx={{ minWidth: 650 }} stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  color: "text.secondary",
                },
              }}
            >
              {tableHeaders.map((str, i) => {
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
            {tableEntries.map((entry, i) => (
              <TableRow
                key={entry.Invoice_ID || i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {entry.Invoice_ID}
                </TableCell>
                <TableCell>{entry.Date}</TableCell>
                <TableCell>{entry.Invoice_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={invoiceEntries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
