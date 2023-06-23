import { Box } from "@mui/material";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { NoResults } from "./components/noResults";
import { SkeletonTable } from "~/components/table";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import SearchTable from "~/components/table";
import { retrieveRSBOMSearchResults } from "~/models/rsboms.server";
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
        searchResults: null,
      });

    const { _searchString } = parseFilterParam(filter);

    if (!_searchString) {
      return json({
        error: "",
        searchResults: null,
      });
    }

    const searchResults = await retrieveRSBOMSearchResults(
      {
        userId,
        organizationId,
        page,
        perPage,
        sort,
      },
      _searchString
    );

    return json({ searchResults, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({
      error,
      searchResults: null,
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
  const { searchResults, error } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  if (error) {
    return <Box>{error}</Box>;
  }

  if (!searchResults || !searchResults.data.length) {
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
        tableData={searchResults.data || undefined}
        // TODO Disabled until Search API is determined
        // totalItems={searchResults.metadata?.page.total}
        tableTitle="Search Results"
        linkKey="dataObject"
        headers={tableHeaders}
        tableContainerStyles={{ maxHeight: "600px" }}
      />
    </Box>
  );
}
