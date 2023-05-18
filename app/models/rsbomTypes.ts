import type { Normalized } from "@cyclonedx/cyclonedx-library/src/serialize/json/types";

export interface RSBOMListEntry {
  "@timestamp": string;
  dataObject: string;
  filename: string;
  id: string;
}

// The data return from Bearclaw didn't quite lineup with the standardized CycloneDX format as far as I could tell. Small tweaks below to align it
export interface ExpandedRSBOMEntry extends Omit<Normalized.Bom, "components"> {
  taskId: string;
  id: string;
  component: Normalized.Component[];
  "@timestamp": string;
}
