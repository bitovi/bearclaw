import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "~/components/link";
import type { ExpandedRSBOMEntry } from "~/models/rsbomTypes";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const DownloadButton = ({
  filename,
  id,
  expandedRSBOM,
  label,
}: {
  expandedRSBOM?: ExpandedRSBOMEntry | null;
  filename?: string;
  id: string;
  label?: string;
}) => {
  if (!expandedRSBOM) return null;
  return (
    <Box
      paddingTop={{ xs: 3, md: 1 }}
      alignSelf={{ xs: "flex-start", md: "center" }}
    >
      <Button
        LinkComponent={Link}
        sx={{ textAlign: "start" }}
        variant="text"
        href={
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(expandedRSBOM, undefined, 2))
        }
        download={`${filename || id}.json`}
      >
        <Typography
          component={Stack}
          noWrap
          variant="body2"
          direction="row"
          alignItems="flex-start"
        >
          <FileDownloadIcon />
          {label || "Download RSBOM"}
        </Typography>
      </Button>
    </Box>
  );
};
