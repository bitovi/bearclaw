import { Box } from "@mui/material";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { NoResults } from "./components/noResults";
import SearchTable, { SkeletonTable } from "~/components/table";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { parseFilterParam } from "~/utils/parseFilterParam";
import { getOrgandUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const perPage = url.searchParams.get("perPage");
    const filter = url.searchParams.get("filter");
    const sort = url.searchParams.get("sort");

    // if user vists /search with no query, return no results
    if (!filter)
      return json({
        error: "",
        dataObjectList: null,
        filenameList: null,
      });

    // TODO Resolve this
    // On our end manage making separate queries to Data Object and Filename until Search logic/API can be settled
    const { _searchString } = parseFilterParam(filter);

    if (!_searchString) {
      return json({
        error: "",
        dataObjectList: null,
        filenameList: null,
      });
    }

    const dataObjectList = await retrieveRSBOMList({
      userId,
      organizationId,
      page,
      perPage,
      filter: `contains=(dataObject,${_searchString})`,
      sort,
    });
    const filenameList = await retrieveRSBOMList({
      userId,
      organizationId,
      page,
      perPage,
      filter: `contains=(filename,${_searchString})`,
      sort,
    });

    // //

    return json({ dataObjectList, filenameList, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({
      error,
      dataObjectList: null,
      filenameList: null,
    });
  }
}

const tableHeaders = [
  {
    label: "Id",
    value: "id",
    sortable: false,
  },
  { label: "Filename", value: "filename", sortable: true },
  { label: "Date", value: "@timestamp", sortable: true },
  { label: "Object Id", value: "dataObject", sortable: true },
  { label: "Type", value: "mime-type", sortable: true },
  { label: "Status", value: "completedStatus", sortable: true },
];

export default function Route() {
  const { dataObjectList, filenameList, error } =
    useLoaderData<typeof loader>();

  const navigation = useNavigation();

  if (error) {
    return <Box>{error}</Box>;
  }

  if (
    (!dataObjectList && !filenameList) ||
    (!dataObjectList.data.length && !filenameList.data.length)
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
        tableData={dataObjectList.data || undefined}
        // TODO Disabled until Search API is determined
        // totalItems={dataObjectList.metadata?.page.total}
        tableTitle="Search By Data Object"
        linkKey="dataObject"
        headers={tableHeaders}
        tableContainerStyles={{ maxHeight: "600px" }}
      />
      <SearchTable<RSBOMListEntry>
        tableData={filenameList.data || undefined}
        // TODO Disabled until Search API is determined
        // totalItems={filenameList.metadata?.page.total}
        tableTitle="Search By Filename"
        linkKey="dataObject"
        headers={tableHeaders}
        tableContainerStyles={{ maxHeight: "600px" }}
      />
    </Box>
  );
}
