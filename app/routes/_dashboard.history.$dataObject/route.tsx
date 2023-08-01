import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CVETable } from "./component/cveTable";
import { CVEDrawer } from "./component/cveDrawer";
import { useState } from "react";
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
import ChildJobsTable from "~/components/table";
import Chip from "@mui/material/Chip";
import { toTitleCase } from "~/utils/string/toTitleCase";
import NavigateNextSharpIcon from "@mui/icons-material/NavigateNextSharp";
import { ProcessingStatusChipColor } from "~/components/table/types";
import { AccordionTable } from "./component/accordionTable";
import { getAllChildJobs } from "~/services/bigBear/getAllChildJobs.server";

dayjs.extend(utc);

export async function loader({ request, params }: LoaderArgs) {
  const { dataObject } = params;
  if (!dataObject) {
    return redirect("/history");
  }

  try {
    const { userId, organizationId } = await getOrgandUserId(request);

    const processingStatus = await getProcessingStatusById({
      dataObject,
      userId,
      organizationId,
    });
    if (!processingStatus) {
      return redirect("/history");
    }

    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const perPage = url.searchParams.get("perPage") || "10";

    const childJobs = await getAllChildJobs({
      params: { userId, organizationId, page, perPage },
      dataObject,
    });

    const { data: vulnerabilities, metadata } = await getCVEData({
      params: { userId, organizationId },
      dataObject,
    });

    const expandedRSBOM = await retrieveRSBOMDetails({
      userId,
      organizationId,
      dataObjectId: dataObject,
    });

    return json({
      processingStatus: {
        ...processingStatus,
        analyzedAt: dayjs(processingStatus?.analyzedAt).format(
          "MM/DD/YYYY - HH:MM:ss"
        ),
      },
      vulnerabilities,
      expandedRSBOM,
      childJobs,
      metadata,
      error: "",
    });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({
      processingStatus: null,
      vulnerabilities: [],
      metadata: null,
      childJobs: null,
      expandedRSBOM: null,
      error,
    });
  }
}

export default function Route() {
  const {
    processingStatus,
    vulnerabilities,
    expandedRSBOM,
    metadata,
    childJobs,
    error,
  } = useLoaderData<typeof loader>();
  const copy = usePageCopy("detail");
  const [selectedCVE, setSelectedCVE] =
    useState<(typeof vulnerabilities)[number]>();

  const [visible, setVisible] = useState(false);

  if (error) {
    return <Box>{error}</Box>;
  }
  return (
    <Stack height="100%" alignItems={{ xs: "center", md: "unset" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
      >
        <Stack gap={1}>
          <Typography variant="h3" color="text.primary">
            {copy?.content?.pageHeader}{" "}
            {processingStatus?.filename || "file upload"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {processingStatus?.status === ProcessingStatus.COMPLETE
              ? copy?.headline
              : copy?.content?.analysisInProcess}
          </Typography>
        </Stack>

        {processingStatus?.status === ProcessingStatus.COMPLETE && (
          <DownloadButton
            expandedRSBOM={expandedRSBOM}
            id={processingStatus._id}
            filename={processingStatus.filename}
            label={copy?.content?.downloadRSBOM}
          />
        )}
      </Stack>

      <Box paddingTop={4}>
        <CVEBreakdown
          id={processingStatus?._id}
          type={processingStatus?.type}
          date={processingStatus?.analyzedAt}
          metadata={metadata}
        />
      </Box>

      <AccordionTable
        heading={`Subcomponents for '${
          processingStatus?.filename || "component"
        }'`}
        subheading="Select the component to which you wish to navigate"
      >
        <ChildJobsTable
          headers={[
            { label: "Component Name", value: "filename", sortable: false },
            { label: "Type", value: "type", sortable: false },
            { label: "Date", value: "dateAnalyzed", sortable: false },
            {
              label: "Status",
              value: "status",
              sortable: false,
            },
            { label: "Object ID", value: "id", sortable: false },
          ]}
          linkKey="id"
          linkIcon={() => <NavigateNextSharpIcon />}
          totalItems={childJobs?.metadata?.page.total}
          tableData={childJobs?.data.map((job) => ({
            ...job,
            dateAnalyzed: (
              <Box display="flex" flexDirection="column">
                <Typography variant="body2">
                  {dayjs
                    .utc(new Date(job.dateAnalyzed))
                    .local()
                    .format("MM/DD/YY")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dayjs
                    .utc(new Date(job.dateAnalyzed))
                    .local()
                    .format("HH:mm:ss")}
                </Typography>
              </Box>
            ),
            status: (
              <Chip
                variant={
                  job.status === ProcessingStatus.COMPLETE
                    ? "outlined"
                    : "filled"
                }
                color={ProcessingStatusChipColor[job.status]}
                label={toTitleCase(job.status)}
              />
            ),
          }))}
        />
      </AccordionTable>

      <CVETable
        processingStatus={processingStatus?.status}
        orientation="row"
        cveData={vulnerabilities}
        handleRowClick={(id: string) => {
          setSelectedCVE(vulnerabilities.find((cve) => cve.name === id));
          setVisible(true);
        }}
      />

      <CVEDrawer
        open={visible}
        selectedCVE={selectedCVE}
        onClose={() => setVisible(false)}
      />
    </Stack>
  );
}
