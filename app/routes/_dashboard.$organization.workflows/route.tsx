import Stack from "@mui/material/Stack";
import { Page, PageHeader } from "../_dashboard/components/page";
import { WorkflowModule } from "./components/workflowModule";
import type { WorkflowIconEnum } from "./types";

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
    options: fixture_Options,
  },
  {
    title: "BinAlyzer",
    type: "INPUT" as keyof typeof WorkflowIconEnum,
    options: fixture_Options,
  },
  {
    title: "Binwalk",
    type: "INPUT" as keyof typeof WorkflowIconEnum,
    options: fixture_Options,
  },
];

const fixture_ModulesActions = [
  {
    title: "Strings Search",
    type: "ACTION" as keyof typeof WorkflowIconEnum,
    options: fixture_Options,
  },
  {
    title: "CVE Search",
    type: "ACTION" as keyof typeof WorkflowIconEnum,
    options: fixture_Options,
  },
  {
    title: "Reverse SBOM",
    type: "ACTION" as keyof typeof WorkflowIconEnum,
    options: fixture_Options,
  },
];

const fixture_DataStore = [
  {
    title: "Save to Primary",
    type: "ACCESS" as keyof typeof WorkflowIconEnum,
    options: fixture_Options,
  },
  {
    title: "Save to Secondary",
    type: "ACCESS" as keyof typeof WorkflowIconEnum,
    options: fixture_Options,
  },
  {
    title: "Download",
    type: "ACCESS" as keyof typeof WorkflowIconEnum,
    options: fixture_Options,
  },
];

export default function Route() {
  return (
    <Page>
      <PageHeader
        headline="Worfklow"
        description="These are the predefined processes your uploads undergo during analysis."
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
