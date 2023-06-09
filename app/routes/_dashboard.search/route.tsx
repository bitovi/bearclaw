import { Box } from "@mui/material";
import { LoaderArgs, defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { NoResults } from "./components/noResults";
import { Suspense } from "react";
import { SkeletonTable } from "~/components/table";
import { RSBOMListEntry } from "~/models/rsbomTypes";
import SearchTable from "~/components/table";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { parseFilterParam } from "~/utils/parseFilterParam";

export async function loader({ request }: LoaderArgs) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // if user vists /search with no query, return no results
    if (!searchParams.has("filter"))
      return defer({ filenameList: [], dataObjectList: [], error: "" });

    // TODO Resolve this
    // On our end manage making separate queries to Data Object and Filename until Search logic/API can be settled
    const { _searchString } = parseFilterParam(searchParams.get("filter"));
    const dataObjectParam = new URLSearchParams();
    dataObjectParam.append("filter", `contains=(dataObject,${_searchString})`);

    const filenameParam = new URLSearchParams();
    filenameParam.append("filter", `contains=(filename,${_searchString})`);

    const dataObjectList = retrieveRSBOMList(dataObjectParam);
    const filenameList = retrieveRSBOMList(filenameParam);
    // //

    return defer({ dataObjectList, filenameList, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return defer({ error, dataObjectList: [], filenameList: [] });
  }
}

export default function Route() {
  const { dataObjectList, filenameList, error } =
    useLoaderData<typeof loader>();

  return (
    <Suspense
      fallback={
        <SkeletonTable
          search
          searchFields={[]}
          tableTitle="History"
          headers={[
            "Id",
            "Filename",
            "Timestamp",
            "Data Object",
            "Type",
            "Status",
          ]}
        />
      }
    >
      <Await resolve={Promise.all([filenameList, dataObjectList])}>
        {([dataObjectList, filenameList]) => {
          if (
            (!dataObjectList && !filenameList) ||
            (!dataObjectList.length && filenameList.length)
          ) {
            return <NoResults />;
          }
          return (
            <Box paddingY={2}>
              <SearchTable<RSBOMListEntry>
                tableData={dataObjectList || undefined}
                tableTitle="Search By Data Object"
                linkKey="dataObject"
                headers={[
                  "Id",
                  "Filename",
                  "Timestamp",
                  "Data Object",
                  "Type",
                  "Status",
                ]}
                tableContainerStyles={{ maxHeight: "600px" }}
              />
              <SearchTable<RSBOMListEntry>
                tableData={filenameList || undefined}
                tableTitle="Search By Filename"
                linkKey="dataObject"
                headers={[
                  "Id",
                  "Filename",
                  "Timestamp",
                  "Data Object",
                  "Type",
                  "Status",
                ]}
                tableContainerStyles={{ maxHeight: "600px" }}
              />
            </Box>
          );
        }}
      </Await>
      {/* <Await resolve={dataObjectList}>
        {(dataObjectList) => {
          if (!dataObjectList || !dataObjectList.length) {
            return <NoResults />;
          }
          return (
            <Box paddingY={2}>
              <SearchTable<RSBOMListEntry>
                tableData={dataObjectList || undefined}
                tableTitle="Search By Data Object"
                linkKey="dataObject"
                headers={[
                  "Id",
                  "Filename",
                  "Timestamp",
                  "Data Object",
                  "Type",
                  "Status",
                ]}
                tableContainerStyles={{ maxHeight: "600px" }}
              />
            </Box>
          );
        }}
      </Await>
      <Await resolve={filenameList}>
        {(filenameList) => {
          console.log("filenamelist", filenameList);

          if (!filenameList || !filenameList.length) {
            return <NoResults />;
          }
          return (
            <Box>
              <SearchTable<RSBOMListEntry>
                tableData={filenameList || undefined}
                tableTitle="Search By Filename"
                linkKey="dataObject"
                headers={[
                  "Id",
                  "Filename",
                  "Timestamp",
                  "Data Object",
                  "Type",
                  "Status",
                ]}
                tableContainerStyles={{ maxHeight: "600px" }}
              />
            </Box>
          );
        }}
      </Await> */}
    </Suspense>
  );
}
