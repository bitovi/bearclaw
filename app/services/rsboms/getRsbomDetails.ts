export type ApiRsbomResponse = {
  bc_rsbom_cyclonedx_aggregate: ApiBcRsbomCyclonedxAggregate[];
};

export type ApiBcRsbomCyclonedxAggregate = {
  "@timestamp": Date;
  bomFormat: string;
  component: {
    "bom-ref": string;
    components: string[];
    file: {
      fileinfo: {
        md5: string;
        sha1: string;
        sha256: string;
      };
      filename: string;
      filesize: number;
    };
    library: Array<{
      cves: Array<{
        CVEID: string;
        summary?: string;
      }> | null;
      name: string;
    }>;
    license: string;
    "mime-type": string;
    properties: Array<{
      key: string;
      value: number | string;
    }>;
    supplier: string[];
    type: string;
  };
  dependencies: {
    components: any[];
  };
  id: string;
  metadata: {
    authors: string;
    license: string;
    supplier: string;
    timestamp: Date;
    tools: string;
  };
  specVersion: string;
  taskId: string;
  version: string;
  vulnerabilities: Array<{
    Details: string;
    Source: string;
    "bom-ref": string;
    id: string;
    Exploitability?: {
      attackcomplexity: AttackComplexity;
      attackvector: AttackVector;
      privilegesrequired: AttackComplexity;
      scope: Scope;
      userinteraction: UserInteraction;
    };
    exploitabilityScore?: number;
  }>;
};

export type AttackComplexity = "LOW" | "HIGH" | "NONE";

export type AttackVector =
  | "NETWORK"
  | "LOCAL"
  | "ADJACENT_NETWORK"
  | "PHYSICAL";

export type Scope = "UNCHANGED" | "CHANGED";

export type UserInteraction = "NONE" | "REQUIRED";

export type RsbomCyclonedxAggregate = {
  timestamp: Date;
  bomFormat: string;
  component: {
    bomRef: string;
    components: string[];
    file: {
      fileInfo: {
        md5: string;
        sha1: string;
        sha256: string;
      };
      fileName: string;
      fileSize: number;
    };
    library: Array<{
      cves: Array<{
        CveId: string;
        summary?: string;
      }> | null;
      name: string;
    }>;
    license: string;
    mimeType: string;
    properties: Array<{
      key: string;
      value: number | string;
    }>;
    supplier: string[];
    type: string;
  };
  dependencies: {
    components: any[];
  };
  id: string;
  metadata: {
    authors: string;
    license: string;
    supplier: string;
    timestamp: Date;
    tools: string;
  };
  specVersion: string;
  taskId: string;
  version: string;
  vulnerabilities: Array<{
    details: string;
    source: string;
    bomRef: string;
    id: string;
    exploitability?: {
      attackComplexity: AttackComplexity;
      attackVector: AttackVector;
      privilegesRequired: AttackComplexity;
      scope: Scope;
      userInteraction: UserInteraction;
    };
    exploitabilityScore?: number;
  }>;
};

const transformRsbom = (
  rsbom: ApiBcRsbomCyclonedxAggregate
): RsbomCyclonedxAggregate => {
  return {
    timestamp: rsbom["@timestamp"],
    bomFormat: rsbom.bomFormat,
    component: {
      bomRef: rsbom.component["bom-ref"],
      components: rsbom.component.components,
      file: {
        fileInfo: {
          md5: rsbom.component.file.fileinfo.md5,
          sha1: rsbom.component.file.fileinfo.sha1,
          sha256: rsbom.component.file.fileinfo.sha256,
        },
        fileName: rsbom.component.file.filename,
        fileSize: rsbom.component.file.filesize,
      },
      library: rsbom.component.library.map((library) => ({
        cves:
          library.cves?.map((cve) => ({
            CveId: cve.CVEID,
            summary: cve.summary,
          })) || [],
        name: library.name,
      })),
      license: rsbom.component.license,
      mimeType: rsbom.component["mime-type"],
      properties: rsbom.component.properties.map((property) => ({
        key: property.key,
        value: property.value,
      })),
      supplier: rsbom.component.supplier,
      type: rsbom.component.type,
    },
    dependencies: {
      components: rsbom.dependencies.components,
    },
    id: rsbom.id,
    metadata: {
      authors: rsbom.metadata.authors,
      license: rsbom.metadata.license,
      supplier: rsbom.metadata.supplier,
      timestamp: rsbom.metadata.timestamp,
      tools: rsbom.metadata.tools,
    },
    specVersion: rsbom.specVersion,
    taskId: rsbom.taskId,
    version: rsbom.version,
    vulnerabilities: rsbom.vulnerabilities.map((vulnerability) => ({
      details: vulnerability.Details,
      source: vulnerability.Source,
      bomRef: vulnerability["bom-ref"],
      id: vulnerability.id,
      exploitability: vulnerability.Exploitability
        ? {
            attackComplexity: vulnerability.Exploitability.attackcomplexity,
            attackVector: vulnerability.Exploitability.attackvector,
            privilegesRequired: vulnerability.Exploitability.privilegesrequired,
            scope: vulnerability.Exploitability.scope,
            userInteraction: vulnerability.Exploitability.userinteraction,
          }
        : undefined,
      exploitabilityScore: vulnerability.exploitabilityScore,
    })),
  };
};

export const getRsbomDetails = async (
  id: string
): Promise<RsbomCyclonedxAggregate> => {
  const url = `${process.env.BEARCLAW_URL}/bear/get_rsboms_cyclonedx/${id}`;
  try {
    const response = await fetch(url);
    const json: ApiRsbomResponse = await response.json();
    const apiRsbom = json.bc_rsbom_cyclonedx_aggregate[0];
    return apiRsbom && transformRsbom(apiRsbom);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(url, error);
    }
    // TODO: Send error to Sentry?
    throw new Error("Unable to get rSBOM");
  }
};
