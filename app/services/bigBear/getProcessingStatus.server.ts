import type {
  ApiRequestParams,
  ApiResponseWrapper,
} from "~/services/bigBear/utils.server";
import { buildApiSearchParams } from "~/services/bigBear/utils.server";
import { bearFetch } from "./bearFetch.server";

// Example response
// {
//   "data": [
//       {
//           "_id": "8944da5a861ece00185fa173ea65324e7d4797aa863c6fa0f03e066805974b6c",
//           "filename": "Lato-Black.ttf",
//           "size": 69484,
//           "type": "application/font-sfnt",
//           "status": "not started",
//           "dateAnalyzed": "2023-06-07 17:57:51.699000"
//       }
//   ],
//   "processingTime": 0.028655666974373162
// }

type UploadStatusResponse = ApiResponseWrapper<
  Array<{
    _id: string;
    dateAnalyzed: string;
    filename: string;
    size: number;
    status: "complete" | "running" | "not started";
    severity: "Critical" | "High" | "Medium" | "Low" | "Unknown" | "Passed";
    type: string;
  }>
>;

export type UploadStatus = {
  _id: string;
  analyzedAt: string;
  filename: string;
  size: number;
  status: "complete" | "running" | "not started";
  severity: "Critical" | "High" | "Medium" | "Low" | "Unknown" | "Passed";
  type: string; // TODO: make this an enum
};

function transformApiUploadStatus(
  job: UploadStatusResponse["data"][number]
): UploadStatus {
  return {
    _id: job._id,
    analyzedAt: job.dateAnalyzed,
    filename: job.filename,
    size: job.size,
    status: job.status,
    severity: job.severity,
    type: job.type,
  };
}

export const getProcessingStatus = async (params: ApiRequestParams) => {
  try {
    const response = await bearFetch(
      `/claw/get_processing_status?${buildApiSearchParams(params)}`
    );
    const json: UploadStatusResponse = await response.json();

    return {
      ...json,
      data: json.data.map((job) => transformApiUploadStatus(job)),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getProcessingStatusById = async ({
  dataObject,
  userId,
  organizationId,
}: {
  dataObject: string;
  userId: string;
  organizationId: string;
}) => {
  const response = await bearFetch(
    `/claw/get_processing_status/${dataObject}?showChildren=true&${buildApiSearchParams(
      {
        userId,
        organizationId,
      }
    )}`
  );

  const json: UploadStatusResponse = await response.json();

  if (!json.data[0]) return null;
  return transformApiUploadStatus(json.data[0]);
};
