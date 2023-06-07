import { Box } from "@mui/material";
import HistoryTable from "../../components/table";
import { LoaderArgs, json } from "@remix-run/node";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { useLoaderData } from "@remix-run/react";
import type { RSBOMListEntry } from "~/models/rsbomTypes";

export async function loader({ request }: LoaderArgs) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const rsbomList = await retrieveRSBOMList(searchParams);

    return json({ rsbomList, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({ error, rsbomList: [] });
  }
}

export default function Route() {
  const { rsbomList, error } = useLoaderData<typeof loader>();

  return (
    <Box>
      {error ? (
        <Box textAlign={"center"}> {error} </Box>
      ) : (
        <HistoryTable<RSBOMListEntry>
          linkKey="dataObject"
          tableTitle={"Lists"}
          tableData={rsbomList || undefined}
          headers={[
            "Id",
            "Filename",
            "Timestamp",
            "Data Object",
            "Type",
            "Status",
          ]}
          tableContainerStyles={{ maxHeight: "600px" }}
          search
          endpoint="/history"
          searchFields={[
            {
              value: "dataObject",
              label: "Data Object",
            },
            {
              value: "filename",
              label: "Filename",
            },
          ]}
        />
      )}
    </Box>
  );
}
