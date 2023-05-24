import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import dayjs from "dayjs";
import type { DataObject } from "~/services/dataObjects/getAllDataObjects";

type Props = {
  data: DataObject[];
}

export function DataTable({ data }: Props) {

  return (
    <TableContainer>
      <Typography fontWeight="400" fontSize="1.6rem" margin=".5rem 1rem">Recent Activity</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Filename</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">File Size</TableCell>
            <TableCell align="right">Analyzed At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="center">{item.type}</TableCell>
              <TableCell align="center">{getFileSize(item)}</TableCell>
              <TableCell align="right">{dayjs(item.lastUpdateDateTime).format("MMMM DD, YYYY")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function getFileSize(data: DataObject): string {
  const fileSize = data.extraData.find(j => j.key === "file_size")?.value;

  if (!fileSize) return "N/A";

  const number = Number(fileSize)

  if (number < 1_000) {
    return `${number} bytes`
  } else if (number < 1_000_000) {
    return `${(number / 1_000).toFixed(1).toLocaleString()} KB`
  } else {
    return `${(number / 1_000_000).toFixed(1).toLocaleString()} MB`
  }
}
