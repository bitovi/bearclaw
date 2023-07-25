import type { ApiRequestParams } from "~/services/bigBear/utils.server";
import { buildApiSearchParams } from "~/services/bigBear/utils.server";
import { bearFetch } from "./bearFetch.server";
import type { CveData } from "~/models/rsbomTypes";
import dayjs from "dayjs";

/**
 * Example response:
 * {
  cves: [
    {
      Modified: "2022-12-09 14:38:00",
      Published: "2022-12-07 04:15:00",
      access: {},
      assigner: "vultures@jpcert.or.jp",
      cvss: null,
      cvss3: 5.5,
      "cvss3-vector": "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:H",
      cwe: "CWE-20",
      exploitability3: {
        attackcomplexity: "LOW",
        attackvector: "LOCAL",
        privilegesrequired: "LOW",
        scope: "UNCHANGED",
        userinteraction: "NONE",
      },
      exploitabilityScore3: 1.8,
      id: "CVE-2022-41783",
      impact: {},
      impact3: {
        availability: "HIGH",
        confidentiality: "NONE",
        integrity: "NONE",
      },
      impactScore3: 3.6,
      "last-modified": { $date: 1670596680000 },
      products: ["re3000_firmware"],
      references: [
        "https://www.tp-link.com/en/support/download/re300/v1/#Firmware",
        "https://jvn.jp/en/jp/JVN29657972/index.html",
      ],
      summary:
        "tdpServer of TP-Link RE300 V1 improperly processes its input, which may allow an attacker to cause a denial-of-service (DoS) condition of the products OneMesh function.",
      vendors: ["tp-link"],
      vulnerable_configuration: [
        {
          id: "cpe:2.3:o:tp-link:re3000_firmware:*:*:*:*:*:*:*:*",
          title: "cpe:2.3:o:tp-link:re3000_firmware:*:*:*:*:*:*:*:*",
        },
        {
          id: "cpe:2.3:h:tp-link:re3000:1.0:*:*:*:*:*:*:*",
          title: "cpe:2.3:h:tp-link:re3000:1.0:*:*:*:*:*:*:*",
        },
      ],
      vulnerable_configuration_cpe_2_2: [],
      vulnerable_configuration_stems: [
        "cpe:2.3:o:tp-link:re3000_firmware",
        "cpe:2.3:h:tp-link:re3000",
      ],
      vulnerable_product: ["cpe:2.3:o:tp-link:re3000_firmware:*:*:*:*:*:*:*:*"],
      vulnerable_product_stems: ["cpe:2.3:o:tp-link:re3000_firmware"],
      cvss_base_score_risk: [5.5, "Medium"],
      cvss_temporal_score_risk: [5.5, "Medium"],
    },
    ...
  ],
  metadata: {
    totalVulnerabilitiesCaptured: 5,
    numberofCriticalWarnings: 1,
    numberofHighWarnings: 3,
    numberofMedWarnings: 1,
    numberofLowWarnings: 0,
  },
  processingTime: 0.004719085060060024,
};
 */

//  TODO: Conversation with API team to understand these vulnerability fields, what is reliably provided, what is important
// As of now, the data response fields do not correspond to a Vulnerability type from the cyclonedx format
function transformCVEData(vul: any): CveData {
  return {
    name: vul?.id,
    source: { name: vul?.assigner },
    score: vul?.cvss_base_score_risk?.[1],
    rating: vul?.cvss_base_score_risk?.[0],
    lastModified: dayjs(vul?.["last-modified"]?.["$date"]).format("MM/DD/YYYY"),
    publishedDate: dayjs(vul?.Published).format("MM/DD/YYYY"),
    subcomponents: [],
    description: vul?.summary,
  };
}

type CVEResponse = {
  cves?: any[];
  metadata?: {
    totalVulnerabilitiesCaptured: number;
    numberofCriticalWarnings: number;
    numberofHighWarnings: number;
    numberofMedWarnings: number;
    numberofLowWarnings: number;
  };
};

export async function getCVEData({
  params,
  dataObject,
}: {
  params: Pick<ApiRequestParams, "organizationId" | "userId">;
  dataObject: string;
}) {
  const response = await bearFetch(
    `/bear/get_cve_data/${dataObject}?${buildApiSearchParams(params)}`
  );

  const json: CVEResponse = await response.json();

  return {
    ...json,
    data: json.cves?.map((d) => transformCVEData(d)) || [],
  };
}
