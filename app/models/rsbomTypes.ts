import type { Normalized } from "@cyclonedx/cyclonedx-library/src/serialize/json/types";

export interface RSBOMListEntry {
  "@timestamp": string;
  dataObject: string;
  filename: string;
  id: string;
}

// this section of response from Bearclaw appeared to be missing from the Cyclonedx format standard
interface CyclonedxFile {
  fileInfo?: {
    md5?: string;
    sha1?: string;
    sha256?: string;
  };
  filename?: string;
  filesize?: number;
}

interface Component extends Normalized.Component {
  file: CyclonedxFile;
}

// The data return from Bearclaw didn't quite lineup with the standardized CycloneDX format as far as I could tell. Small tweaks below to align it
export interface ExpandedRSBOMEntry extends Omit<Normalized.Bom, "components"> {
  taskId: string;
  id: string;
  component: Component;
  "@timestamp": string;
}
