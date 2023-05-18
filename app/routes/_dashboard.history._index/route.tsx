import { Box } from "@mui/material";
import HistoryTable from "../../components/table";
import { ActionArgs, json, redirect } from "@remix-run/node";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { useLoaderData, useSubmit } from "@remix-run/react";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import { useCallback } from "react";

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
export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const dataObject = formData.get("dataObject");

  if (!dataObject || typeof dataObject !== "string") {
    return json({});
  }
  return redirect(`./${dataObject}`);
}

export default function Route() {
  const { rsbomList, error } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleTableRowClick = useCallback(
    (entry: RSBOMListEntry) => {
      const formData = new FormData();
      formData.append("dataObject", entry.dataObject);
      submit(formData, {
        action: `/history`,
        method: "post",
      });
    },
    [submit]
  );

  return (
    <Box>
      {error ? (
        <Box textAlign={"center"}> {error} </Box>
      ) : (
        <HistoryTable<RSBOMListEntry>
          tableTitle={"Lists"}
          tableData={rsbomList || undefined}
          onRowClick={handleTableRowClick}
          headers={["Timestamp", "Data Object", "Filename", "ID"]}
          tableContainerStyles={{ maxHeight: "600px" }}
          search
        />
      )}
    </Box>
  );
}
