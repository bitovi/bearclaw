import { Box } from "@mui/material";
import HistoryTable, { SkeletonTable } from "../../components/table";
import { defer } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { Await, useLoaderData } from "@remix-run/react";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import { Suspense } from "react";

export async function loader({ request }: LoaderArgs) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const rsbomList = retrieveRSBOMList(searchParams);

    return defer({ rsbomList, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return defer({ error, rsbomList: [] });
  }
}

export default function Route() {
  const { rsbomList, error } = useLoaderData<typeof loader>();

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
      <Await resolve={rsbomList}>
        {(rsbomList) => {
          if (error) {
            return <Box>{error}</Box>;
          }
          return (
            <Box>
              <HistoryTable<RSBOMListEntry>
                tableTitle={"Lists"}
                tableData={rsbomList || undefined}
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
                search
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
            </Box>
          );
        }}
      </Await>
    </Suspense>
  );
}
