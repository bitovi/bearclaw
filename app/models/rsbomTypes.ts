export interface RSBOMListEntry {
  "@timestamp": string;
  dataObject: string;
  filename: string;
  id: string;
}

// type Tool = {
//   vendor?:
// }
// interface CycloneMetaData {
//   Suppler;
//   Authors;
//   Component;
//   Manufacturer;
//   Tools: string |
// }

export interface RSBOMDetail {
  "@timestamp": string;
  bomFormat: string;
  component: {
    "bom-ref": string;
    components: string[];
    file: {
      fileInfo: {
        md5: string;
        sha1: string;
        sha256: string;
      };
      filename: string;
      filesize: number;
    };
    library: {
      cves:
        | {
            CVEID: string;
            summary: string;
          }[]
        | null;
      name: string;
    }[];
    license: string;
    "mime-type": string;
    properties: {
      key: string;
      value: string | number;
    }[];
    supplier: string[];
    type: string;
    dependencies: {
      components: any[];
    }[];
    id: string;
    metadata: {
      authors: string;
      license: string;
      supplier: string;
      timestamp: string;
      tools: string;
    };
    specVersion: string;
    taskId: string;
    version: string;
    vulnerabilities: any[];
  };
}
