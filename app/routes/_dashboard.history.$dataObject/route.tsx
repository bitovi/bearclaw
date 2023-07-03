import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrieveRSBOMDetails } from "~/models/rsboms.server";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Link } from "~/components/link";
import { CVETable } from "./component/cveTable";
import { CVEDrawer } from "./component/cveDrawer";
import { useState } from "react";
import { CVEBreakdown } from "./component/cveBreakdown";
import { rateVulnerability } from "./utils/vulnerabilityRating.server";
import type { CveData } from "~/models/rsbomTypes";
import { usePageCopy } from "../_dashboard/copy";
import { getOrgandUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const { dataObject } = params;
  if (!dataObject) {
    return redirect("/history");
  }

  try {
    const { userId, organizationId } = await getOrgandUserId(request);

    const expandedRSBOM = await retrieveRSBOMDetails({
      dataObjectId: dataObject,
      userId,
      organizationId,
    });

    const vulnerabilties: CveData[] = expandedRSBOM.vulnerabilities.map(
      (vul) => {
        return {
          name: vul.id,
          rating: rateVulnerability(vul.properties),
          description: vul.description,
          source: vul.source,
          lastModified: vul.published,
        };
      }
    );

    return json({ expandedRSBOM, vulnerabilties, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({ expandedRSBOM: null, vulnerabilties: [], error });
  }
}

export default function Route() {
  const { expandedRSBOM, vulnerabilties, error } =
    useLoaderData<typeof loader>();
  const copy = usePageCopy("detail");
  const [selectedCVE, setSelectedCVE] =
    useState<(typeof vulnerabilties)[number]>();

  const [visible, setVisible] = useState(false);

  if (error) {
    return <Box>{error}</Box>;
  }
  return (
    <Stack>
      {expandedRSBOM && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
        >
          <Stack gap={1}>
            <Typography variant="h3" color="text.primary">
              {copy?.content?.pageHeader}{" "}
              {expandedRSBOM.metadata?.component?.name || "file upload"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {copy?.headline}{" "}
              {vulnerabilties.length > 0
                ? copy?.content?.someVulnerabilities
                : copy?.content?.noVulnerabilities}
            </Typography>
          </Stack>

          <Box alignSelf={"flex-end"}>
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
                <FileDownloadIcon />
                {copy?.content?.downloadRSBOM}
              </Typography>
            </Button>
          </Box>
        </Stack>
      )}

      <Box paddingY={4}>
        <CVEBreakdown
          id={expandedRSBOM?.metadata?.component?.["bom-ref"]}
          type={expandedRSBOM?.metadata?.component?.["mime-type"]}
          date={undefined}
          vulnerabilties={vulnerabilties}
        />
      </Box>
      {!!vulnerabilties.length && (
        <CVETable
          orientation="row"
          cveData={vulnerabilties}
          handleRowClick={(id: string) => {
            setSelectedCVE(vulnerabilties.find((cve) => cve.name === id));
            setVisible(true);
          }}
        />
      )}

      <CVEDrawer
        open={visible}
        selectedCVE={selectedCVE}
        onClose={() => setVisible(false)}
      />
    </Stack>
  );
}
