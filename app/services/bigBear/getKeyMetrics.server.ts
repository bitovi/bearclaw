import { buildApiSearchParams } from "~/services/bigBear/utils.server";
import { bearFetch } from "./bearFetch.server";

type ApiKeyMetrics = {
  metadata: {
    totalFilesAnalyzed: number;
    totalVulnerabilitiesCaptured: number;
    numberofCriticalWarnings: number;
    numberofHighWarnings: number;
    numberofMedWarnings: number;
    numberofLowWarnings: number;
  };
  processingTime: number;
};

type Params = {
  userId?: string;
  organizationId: string;
  days: number;
};

export const getKeyMetrics = async (params: Params) => {
  try {
    const response = await bearFetch(
      `/bear/get_metadata?${buildApiSearchParams(
        params
      )}`
    );
    const json: ApiKeyMetrics = await response.json();
    return json.metadata;
  } catch (error) {
    console.error(error);
    return null;
  }
};
