import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrieveRSBOMDetails } from "~/models/rsboms.server";
import DetailTable from "../../components/table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Link } from "~/components/link";
import { CVECard } from "./component/cveCard";
import { CVETable } from "./component/cveTable";
import { SeverityTab } from "./component/severityTab";
import { CVEDrawer } from "./component/cveDrawer";

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
    <Stack>
      {expandedRSBOM && (
        <Box alignSelf={"flex-end"} paddingBottom={2}>
          <Button
            LinkComponent={Link}
            variant="text"
            href={
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(expandedRSBOM, undefined, 2))
            }
            download={`${
              expandedRSBOM?.metadata?.component?.name || expandedRSBOM?.id
            }.json`}
          >
            <Typography
              component={Stack}
              variant="body2"
              direction="row"
              minHeight="64px"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <FileDownloadIcon /> Download RSBOM
            </Typography>
          </Button>
        </Box>
      )}

      <CVETable
        orientation="row"
        cveData={[
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
          {
            name: "CVE-2005-0125",
            rating: "2.0",
            date: "Published 02/15/2005",
            subcomponent: [{}, {}, {}],
            description:
              "Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw...",
          },
        ]}
      />
      <CVEDrawer />
      {/* <Box>{JSON.stringify(expandedRSBOM)}</Box> */}
    </Stack>
  );
}
/**
 *     <CVECard
          name="CVE-2005-0125"
          rating={"2.0"}
          date="Published 02/15/2005"
          subcomponentCount={5}
          description="Published 03/15/2023 - TP-Link Archer AX21 (AX1800) firmw..."
          orientation="column"
        />
 */
