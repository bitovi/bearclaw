import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { defer, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { CVETable, CVETableSkeleton } from "./component/cveTable";
import { CVEDrawer } from "./component/cveDrawer";
import { CVEBreakdown } from "./component/cveBreakdown";
import { usePageCopy } from "../_dashboard/copy";
import { getOrgandUserId } from "~/session.server";
import { getProcessingStatusById } from "~/services/bigBear/getProcessingStatus.server";
import { getCVEData } from "~/services/bigBear/getCVEData.server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { retrieveRSBOMDetails } from "~/models/rsboms.server";
import { ProcessingStatus } from "./types";
import { DownloadButton } from "./component/downloadButton";
import { ComponentBreakdownAccordion } from "./component/componentBreakdownAccordion";
import { getAllChildJobs } from "~/services/bigBear/getAllChildJobs.server";
import { Suspense, useState } from "react";
import { Loading } from "~/components/loading/Loading";
import type { CveData } from "~/models/rsbomTypes";
import { Page, PageHeader } from "../_dashboard/components/page";
import { retrieveActiveOrganizationUser } from "~/models/organizationUsers.server";

dayjs.extend(utc);

export async function loader({ request, params }: LoaderArgs) {
  const { "*": dataObjects } = params;
  if (!dataObjects) {
    throw redirect("/history");
  }

  try {
    const { userId, organizationId } = await getOrgandUserId(request);
    const orgUser = await retrieveActiveOrganizationUser({
      userId,
      organizationId,
    });
    if (!orgUser) {
      throw redirect("/dashboard");
    }
    const dataObjectList = dataObjects.split("/");

    const targetDataObject = dataObjectList.slice(-1).join("");

    const processingStatus = await getProcessingStatusById({
      dataObject: targetDataObject,
      userId,
      organizationId,
    });

    if (!processingStatus) {
      throw redirect("/history");
    }

    const expandedRSBOM = await retrieveRSBOMDetails({
      userId,
      organizationId,
      dataObjectId: targetDataObject,
    });

    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const perPage = url.searchParams.get("perPage") || "10";

    const childJobs = getAllChildJobs({
      params: { userId, organizationId, page, perPage },
      dataObject: targetDataObject,
    });

    const cveData = getCVEData({
      params: { userId, organizationId },
      dataObject: targetDataObject,
    });

    const breadcrumbEntries = Promise.all(
      dataObjectList.map((id) => {
        return getProcessingStatusById({
          dataObject: id,
          userId,
          organizationId,
        }).then((res) => {
          return res ? { filename: res.filename, id: res._id } : null;
        });
      })
    ).then(
      (res) =>
        res.filter((entry) => !!entry) as Array<{
          filename: string;
          id: string;
        }>
    );

    return defer({
      processingStatus: {
        ...processingStatus,
        analyzedAt: dayjs(processingStatus?.analyzedAt).format(
          "MM/DD/YYYY - HH:MM:ss"
        ),
      },
      expandedRSBOM,
      childJobs,
      breadcrumbEntries,
      cveData,
      error: "",
    });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return defer({
      processingStatus: null,
      cveData: null,
      childJobs: null,
      expandedRSBOM: null,
      breadcrumbEntries: null,
      error,
    });
  }
}

export default function Route() {
  const {
    processingStatus,
    expandedRSBOM,
    cveData,
    childJobs,
    error,
    breadcrumbEntries,
  } = useLoaderData<typeof loader>();
  const copy = usePageCopy("detail");
  const [selectedCVE, setSelectedCVE] = useState<CveData>();

  const [visible, setVisible] = useState(false);

  if (error) {
    return <Box>{error}</Box>;
  }

  return (
    <Page>
      <PageHeader
        detailPage={true}
        headline={
          processingStatus?.status === ProcessingStatus.COMPLETE
            ? `${copy?.content?.pageHeader}${" "}
              ${processingStatus?.filename || "file upload"}`
            : copy?.content?.analysisInProgress || "Analysis in progress..."
        }
        description={`${copy?.headline || "File uploaded"}${" "}${
          processingStatus?.filename
        }`}
      >
        {processingStatus?.status === ProcessingStatus.COMPLETE && (
          <DownloadButton
            expandedRSBOM={expandedRSBOM}
            id={processingStatus._id}
            filename={processingStatus.filename}
            label={copy?.content?.downloadRSBOM}
          />
        )}
      </PageHeader>
      <Stack height="100%" alignItems={{ xs: "center", md: "unset" }}>
        <Box paddingTop={4}>
          <Suspense
            fallback={
              <Stack
                alignItems={"center"}
                justifyContent="center"
                width="100%"
                height="256px"
              >
                <Loading />
              </Stack>
            }
          >
            <Await resolve={cveData}>
              {(cveData) => (
                <CVEBreakdown
                  status={processingStatus?.status}
                  id={processingStatus?._id}
                  type={processingStatus?.type}
                  date={processingStatus?.analyzedAt}
                  metadata={cveData?.metadata}
                />
              )}
            </Await>
          </Suspense>
        </Box>

        <ComponentBreakdownAccordion
          status={processingStatus?.status}
          childJobs={childJobs}
          breadCrumbEntries={breadcrumbEntries}
          tableHeading={`${
            copy?.content?.subscomponentTableHeading || "Subcomponents for"
          } '${processingStatus?.filename || "component"}'`}
          tableSubheading={
            copy?.content?.subscomponentTableSubheading ||
            "Select the component to which you wish to navigate."
          }
        />

        <Suspense fallback={<CVETableSkeleton />}>
          <Await resolve={cveData}>
            {(cveData) => (
              <CVETable
                processingStatus={processingStatus?.status}
                orientation="row"
                cveData={cveData?.data}
                handleRowClick={(id: string) => {
                  setSelectedCVE(cveData?.data.find((cve) => cve.name === id));
                  setVisible(true);
                }}
              />
            )}
          </Await>
        </Suspense>

        <CVEDrawer
          open={visible}
          selectedCVE={selectedCVE}
          onClose={() => setVisible(false)}
        />
      </Stack>
    </Page>
  );
}
