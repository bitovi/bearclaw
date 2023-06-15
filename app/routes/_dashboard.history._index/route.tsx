import { Suspense } from "react";
import { Box } from "@mui/material";
import HistoryTable, { SkeletonTable } from "../../components/table";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { Await, useLoaderData } from "@remix-run/react";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import { getOrgandUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const perPage = url.searchParams.get("perPage");
    const filter = url.searchParams.get("filter");
    const rsbomList = await retrieveRSBOMList({
      userId,
      organizationId,
      page,
      perPage,
      filter,
    });

    return json({ rsbomList, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({ error, rsbomList: null });
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
                tableData={rsbomList?.data || undefined}
                totalItems={rsbomList?.metadata?.page.total}
                linkKey="dataObject"
                headers={[
                  { label: "Id", value: "id", sortable: false },
                  { label: "Filename", value: "filename", sortable: false },
                  { label: "Timestamp", value: "@timestamp", sortable: false },
                  {
                    label: "Data Object",
                    value: "dataObject",
                    sortable: false,
                  },
                  { label: "Type", value: "mime-type", sortable: false },
                  {
                    label: "Status",
                    value: "completedStatus",
                    sortable: false,
                  },
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
