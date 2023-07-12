import { buildApiSearchParams } from "~/models/apiUtils.server";

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
    const response = await fetch(
      `${process.env.BEARCLAW_URL}/bear/get_metadata?${buildApiSearchParams(
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
