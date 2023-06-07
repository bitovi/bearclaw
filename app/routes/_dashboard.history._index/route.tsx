import { Box } from "@mui/material";
import HistoryTable from "../../components/table";
import { json } from "@remix-run/node";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { useLoaderData } from "@remix-run/react";
import type { RSBOMListEntry } from "~/models/rsbomTypes";

export async function loader() {
  try {
    const rsbomList = await retrieveRSBOMList();

    return json({ rsbomList, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({ error, rsbomList: [] });
  }
}

export default function Route() {
  const { rsbomList, error } = useLoaderData<typeof loader>();

  console.log("rsbomList", rsbomList[0]);
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
