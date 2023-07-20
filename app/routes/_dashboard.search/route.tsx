import Box from "@mui/material/Box";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { NoResults } from "./components/noResults";
import SearchTable, { SkeletonTable } from "~/components/table";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { getOrgandUserId } from "~/session.server";
import { Page, PageHeader } from "../_dashboard/components/page";
import { Typography } from "@mui/material";
import { usePageCopy } from "../_dashboard/copy";

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const perPage = url.searchParams.get("perPage") || "10";
  const sort = url.searchParams.get("sort");
  const query = url.searchParams.get("query");
  // if user vists /search with no query, return no results
  if (!query) {
    return json({
      query: "",
      error: "",
      dataObjectList: null,
      filenameList: null,
    });
  }
  console.log("query: ", query)

  try {
    const dataObjectList = await retrieveRSBOMList({
      userId,
      organizationId,
      page,
      perPage,
      filter: `contains=(dataObject,${query})`,
      sort,
    });
    const filenameList = await retrieveRSBOMList({
      userId,
      organizationId,
      page,
      perPage,
      filter: `contains=(filename,${query})`,
      sort,
    });

    return json({
      query,
      dataObjectList,
      filenameList,
      error: ""
    });
  } catch (e) {
    const error = (e as Error).message;
    console.error("ERROR: ", error);
    return json({
      error,
      query,
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

export function Results() {
  const {
    dataObjectList,
    filenameList,
    error,
  } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  if (error) {
    return <Box>{error}</Box>;
  }
  console.log("filenameList: ", filenameList)
  if (
    (!dataObjectList && !filenameList) ||
    (!dataObjectList.data.length && !filenameList.data.length)
  ) {
    return <NoResults />;
  }

  if (navigation.state === "loading") {
    return (
      <SkeletonTable
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
    <>
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
    </>
  );
}

export default function Route() {
  const {
    query,
    error,
    dataObjectList,
    filenameList,
  } = useLoaderData<typeof loader>();
  const copy = usePageCopy("search")

  const hasResults = !error && (dataObjectList?.data.length || filenameList?.data.length);
  return (
    <Page>
      <PageHeader
        headline={(
          <span>
            {copy?.headline || "Search"}:{" "}
            <Typography fontSize="inherit" fontWeight="inherit" component="span" color="primary.main">
              {query || ""}
            </Typography>
          </span>
        )}
        description={hasResults
          ? copy?.content?.hasResults || "Here are the files we found based on your search."
          : copy?.content?.noResults || "No matches found at this time. Please adjust your search query for better results."
        }
      />
      <Results />
    </Page>
  );
}
