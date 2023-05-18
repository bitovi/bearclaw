import { Box } from "@mui/material";
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrieveRSBOMDetails } from "~/models/rsboms.server";
import DetailTable from "../../components/table";

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
    <Box>
      <DetailTable
        tableTitle={"Some Complex Thing"}
        tableData={[]}
        headers={["Header 1", "Header 2", "Header 3"]}
        search
      />
      <Box>{JSON.stringify(expandedRSBOM)}</Box>
    </Box>
  );
}
