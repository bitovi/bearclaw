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
import { retrieveRSBOMDetails } from "~/models/rsboms.server";
import { ProcessingStatus } from "./types";
import { NoVulnerabilitiesImage } from "./component/noVulnerabilitiesImage";
import { ProcessingResultsImage } from "./component/processingResultsImage";
import { DownloadButton } from "./component/downloadButton";

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
      expandedRSBOM: null,
      error,
    });
  }
}

export default function Route() {
  const { processingStatus, vulnerabilities, expandedRSBOM, metadata, error } =
    useLoaderData<typeof loader>();
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
        direction={{ xs: "column", lg: "row" }}
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
      {processingStatus?.status === ProcessingStatus.COMPLETE && metadata && (
        <Box paddingTop={4}>
          <CVEBreakdown
            id={processingStatus?._id}
            type={processingStatus?.type}
            date={processingStatus?.analyzedAt}
            metadata={metadata}
          />
        </Box>
      )}
      {processingStatus?.status === ProcessingStatus.COMPLETE &&
        !!vulnerabilities.length && (
          <CVETable
            orientation="row"
            cveData={vulnerabilities}
            handleRowClick={(id: string) => {
              setSelectedCVE(vulnerabilities.find((cve) => cve.name === id));
              setVisible(true);
            }}
          />
        )}
      {(processingStatus?.status === ProcessingStatus.RUNNING ||
        processingStatus?.status === ProcessingStatus.NOT_STARTED) && (
        <ProcessingResultsImage image={copy?.images?.processingResults} />
      )}
      {processingStatus?.status === ProcessingStatus.COMPLETE &&
        !vulnerabilities.length && (
          <NoVulnerabilitiesImage image={copy?.images?.noVullnerabilities} />
        )}
      <CVEDrawer
        open={visible}
        selectedCVE={selectedCVE}
        onClose={() => setVisible(false)}
      />
    </Stack>
  );
}
