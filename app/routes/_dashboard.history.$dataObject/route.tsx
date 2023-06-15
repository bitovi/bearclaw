import { Box, Button, Stack, Typography } from "@mui/material";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrieveRSBOMDetails } from "~/models/rsboms.server";
import DetailTable from "../../components/table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Link } from "~/components/link";

export async function loader({ params }: LoaderArgs) {
  const { dataObject } = params;
  if (!dataObject) {
    return redirect("/history");
  }

  try {
    const expandedRSBOM = await retrieveRSBOMDetails({
      dataObjectId: dataObject,
    });
    return json({ expandedRSBOM, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({ expandedRSBOM: null, error });
  }
}

export default function Route() {
  const { expandedRSBOM, error } = useLoaderData<typeof loader>();
  if (error) {
    return <Box>{error}</Box>;
  }

  return (
    <Stack>
      {expandedRSBOM && (
        <Box alignSelf={"flex-end"} paddingBottom={2}>
          <Button
            LinkComponent={Link}
            variant="contained"
            href={
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(expandedRSBOM, undefined, 2))
            }
            download={`${
              expandedRSBOM?.metadata?.component?.name || expandedRSBOM?.id
            }.json`}
          >
            <Typography
              component={Stack}
              variant="body2"
              direction="row"
              minHeight="64px"
              justifyContent={"space-between"}
              alignItems="center"
            >
              Download <FileDownloadIcon />
            </Typography>
          </Button>
        </Box>
      )}
      <DetailTable
        tableTitle={expandedRSBOM?.metadata?.component?.name || "rSBOM Details"}
        tableData={[]}
        headers={[
          { label: "Header 1", value: "header1", sortable: false },
          { label: "Header 2", value: "header2", sortable: false },
          { label: "Header 3", value: "header3", sortable: false },
        ]}
        search
      />

      {/* <Box>{JSON.stringify(expandedRSBOM)}</Box> */}
    </Stack>
  );
}
