import Stack from "@mui/material/Stack";
import { Page, PageHeader } from "../_dashboard/components/page";
import { WorkflowModule } from "./components/workflowModule";
import type { WorkflowIconEnum } from "./types";
import { usePageCopy } from "../_dashboard/copy";

const fixture_Options = [
  {
    description: "Integrate open CVE data",
    id: "234ddfsd",
  },
  {
    description: "Search for component vulnerabilities",
    id: "dsafdsafsdfs",
  },
  {
    description: "Reveal supply chain insights",
    id: "2335t4erfgd",
  },
];

const fixture_CoreData = [
  {
    title: "Strings",
    type: "INPUT" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Extracts readable text from binaries",
        id: "vbndfgdfng",
      },
      {
        description: "Aids reverse engineering and analysis",
        id: "dsaftgrdtyg45hdsafsdfs",
      },
      {
        description: "Reveals insights in software binaries",
        id: "hdbgfhdrt45",
      },
    ],
  },
  {
    title: "BinAlyzer",
    type: "INPUT" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Uses powerful disassembler tools",
        id: "234ddfsd",
      },
      {
        description: "Analyzes various software types",
        id: "dsafdsafsdfs",
      },
      {
        description: "Aids understanding and vulnerability identification",
        id: "2335t4erfgd",
      },
    ],
  },
  {
    title: "Binwalk",
    type: "INPUT" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Analyzes, extracts from firmware images",
        id: "234ddfsd",
      },
      {
        description: "Useful for embedded systems, IoT",
        id: "dsafdsafsdfs",
      },
      {
        description: "Stores Binwalk results for analysis",
        id: "2335t4erfgd",
      },
    ],
  },
];

const fixture_ModulesActions = [
  {
    title: "Strings Search",
    type: "ACTION" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Extracting readable text from binary files",
        id: "234ddfsd",
      },
      {
        description: "Searches strings for binary insights",
        id: "dsafdsafsdfs",
      },
    ],
  },
  {
    title: "CVE Search",
    type: "ACTION" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Integrates open CVE data",
        id: "234ddfsd",
      },
      {
        description: "Search for component vulnerabilities",
        id: "dsafdsafsdfs",
      },
      {
        description: "Reveal supply chain insights",
        id: "2335t4erfgd",
      },
    ],
  },
  {
    title: "Reverse SBOM",
    type: "ACTION" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Lists software components and dependencies",
        id: "234ddfsd",
      },
      {
        description: "Boosts transparency and traceability",
        id: "dsafdsafsdfs",
      },
      {
        description: "Mitigates security vulnerabilities with SBOMs",
        id: "2335t4erfgd",
      },
    ],
  },
];

const fixture_DataStore = [
  {
    title: "Save to Primary",
    type: "ACCESS" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Data saved in MongoDB",
        id: "234ddfsd",
      },
      {
        description: "Workflow output stored centrally",
        id: "dsafdsafsdfs",
      },
    ],
  },
  {
    title: "Save to Secondary",
    type: "ACCESS" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Data saved in Elastic",
        id: "234ddfsd",
      },
      {
        description: "Rich search for analysis",
        id: "dsafdsafsdfs",
      },
    ],
  },
  {
    title: "Download",
    type: "ACCESS" as keyof typeof WorkflowIconEnum,
    options: [
      {
        description: "Download valid CycloneDX JSON SBOM",
        id: "234ddfsd",
      },
      {
        description: "Represents software component details",
        id: "dsafdsafsdfs",
      },
    ],
  },
];

export default function Route() {
  const copy = usePageCopy("workflows");
  return (
    <Page>
      <PageHeader
        headline={copy?.title || "Worfklows"}
        description={
          copy?.headline ||
          "These are the predefined processes your uploads undergo during analysis."
        }
      />
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent={{ xs: "unset", lg: "center" }}
        alignItems={{ xs: "center", lg: "unset" }}
        gap={8}
      >
        <WorkflowModule
          title="CoreData Access"
          workflowProcesses={fixture_CoreData}
        />
        <WorkflowModule
          title="Modules: Actions"
          workflowProcesses={fixture_ModulesActions}
        />
        <WorkflowModule
          title="Data Store"
          workflowProcesses={fixture_DataStore}
        />
      </Stack>
    </Page>
  );
}
