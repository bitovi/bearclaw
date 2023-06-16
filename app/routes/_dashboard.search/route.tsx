import { Box } from "@mui/material";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { NoResults } from "./components/noResults";
import { SkeletonTable } from "~/components/table";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import SearchTable from "~/components/table";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { parseFilterParam } from "~/utils/parseFilterParam";

export async function loader({ request }: LoaderArgs) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // if user vists /search with no query, return no results
    if (!searchParams.has("filter"))
      return json({ filenameList: [], dataObjectList: [], error: "" });

    // TODO Resolve this
    // On our end manage making separate queries to Data Object and Filename until Search logic/API can be settled
    const { _searchString } = parseFilterParam(searchParams.get("filter"));

    if (!_searchString) {
      return json({ filenameList: [], dataObjectList: [], error: "" });
    }

    const dataObjectParam = new URLSearchParams();
    dataObjectParam.append("filter", `contains=(dataObject,${_searchString})`);

    const filenameParam = new URLSearchParams();
    filenameParam.append("filter", `contains=(filename,${_searchString})`);

    const dataObjectList = await retrieveRSBOMList(dataObjectParam);
    const filenameList = await retrieveRSBOMList(filenameParam);

    // //

    return json({ dataObjectList, filenameList, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({ error, dataObjectList: [], filenameList: [] });
  }
}

export default function Route() {
  const { dataObjectList, filenameList, error } =
    useLoaderData<typeof loader>();

  const navigation = useNavigation();

  if (error) {
    return <Box>{error}</Box>;
  }

  if (
    (!dataObjectList && !filenameList) ||
    (!dataObjectList.length && !filenameList.length)
  ) {
    return <NoResults />;
  }

  if (navigation.state === "loading") {
    return (
      <SkeletonTable
        searchFields={[]}
        headers={[
          "Id",
          "Filename",
          "Timestamp",
          "Data Object",
          "Type",
          "Status",
        ]}
      />
    );
  }

  return (
    <Box paddingY={2}>
      <SearchTable<RSBOMListEntry>
        tableData={dataObjectList || undefined}
        tableTitle="Search By Data Object"
        linkKey="dataObject"
        headers={[
          {
            label: "Id",
            value: "id",
            sortable: false,
          },
          { label: "Filename", value: "filename", sortable: false },
          { label: "Date", value: "@timestamp", sortable: true },
          { label: "Object Id", value: "dataObject", sortable: false },
          { label: "Type", value: "mime-type", sortable: false },
          { label: "Status", value: "completedStatus", sortable: true },
        ]}
        tableContainerStyles={{ maxHeight: "600px" }}
      />
      <SearchTable<RSBOMListEntry>
        tableData={filenameList || undefined}
        tableTitle="Search By Filename"
        linkKey="dataObject"
        headers={[
          {
            label: "Id",
            value: "id",
            sortable: false,
          },
          { label: "Filename", value: "filename", sortable: false },
          { label: "Date", value: "@timestamp", sortable: true },
          { label: "Object Id", value: "dataObject", sortable: false },
          { label: "Type", value: "mime-type", sortable: false },
          { label: "Status", value: "completedStatus", sortable: true },
        ]}
        tableContainerStyles={{ maxHeight: "600px" }}
      />
    </Box>
  );
}
