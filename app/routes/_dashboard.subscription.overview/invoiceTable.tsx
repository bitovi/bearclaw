import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { useEffect, useMemo, useState } from "react";
import { InvoiceHistoryItem } from "~/models/subscriptionTypes";

type InvoiceTableProps = {
  invoiceEntries: InvoiceHistoryItem[];
};

export default function InvoiceTable({ invoiceEntries }: InvoiceTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangePage = (_event: unknown, newPage: number) => {
    console.log("PAGE TO SET --- ", page);
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
  useEffect(() => {
    console.log("tableEntries.length", tableEntries.length);
  }, [tableEntries]);

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((str, i) => {
                return <TableCell key={`str-${i}`}>{str}</TableCell>;
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
