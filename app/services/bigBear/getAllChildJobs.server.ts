import { bearFetch } from "./bearFetch.server";
import { buildApiSearchParams } from "./utils.server";
import type { ApiRequestParams, ApiResponseWrapper } from "./utils.server";
/**
 * Example Response:
 * {
  data: [
    {
      _id: "7b2ec03ec3ce0a929d322b69e1e00fafca7352c9a948545e14dbbb8c483f4dfb_clkh1nvt10001vttg5rd28me6",
      Filename: "50",
      Size: 12461104,
      Type: "application/octet-stream",
      Status: "complete",
      isParent: false,
      "Date Analyzed": "2023-07-24 16:32:04.577000",
    },
    {
      _id: "5341e6b2646979a70e57653007a1f310169421ec9bdd9f1a5648f75ade005af1_clkh1nvt10001vttg5rd28me6",
      Filename: "738CE9",
      Size: 256,
      Type: "application/octet-stream",
      Status: "complete",
      isParent: false,
      "Date Analyzed": "2023-07-24 16:32:04.578000",
    },
    {
      _id: "be7695e5263b036584effde0e22dc0f6667d5c126a0c423533f8ad43e46e52ae_clkh1nvt10001vttg5rd28me6",
      Filename: "7EAFA4",
      Size: 17068544,
      Type: "application/octet-stream",
      Status: "complete",
      isParent: false,
      "Date Analyzed": "2023-07-24 16:32:15.333000",
    },
    {
      _id: "66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925_clkh1nvt10001vttg5rd28me6",
      Filename: "BAF8F3",
      Size: 32,
      Type: "application/octet-stream",
      Status: "complete",
      isParent: false,
      "Date Analyzed": "2023-07-24 16:32:04.639000",
    },
  ],
  metadata: {
    page: {
      "current-page": 1,
      "per-page": 10,
      total: 10,
      "last-page": 1,
    },
  },
};
 */

type ChildJob = {
  _id: string;
  Filename: string;
  Size: number;
  Type: string;
  Status: "complete" | "running" | "not started";
  isParent: boolean;
  "Date Analyzed": string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Unknown" | "Passed";
};

export type ChildJobTransformed = {
  id: string;
  filename: string;
  type: string;
  dateAnalyzed: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Unknown" | "Passed";
  status: "complete" | "running" | "not started";
};

type ChildJobsResponse = ChildJob[];

function transformChildJob(job: ChildJob) {
  return {
    filename: job.Filename,
    type: job.Type,
    dateAnalyzed: job["Date Analyzed"],
    status: job.Status,
    severity: job.severity || "Unknown",
    id: job._id,
  };
}

export async function getAllChildJobs({
  params,
  dataObject,
}: {
  params: ApiRequestParams;
  dataObject: string;
}): Promise<ApiResponseWrapper<ChildJobTransformed[]>> {
  const response = await bearFetch(
    `/claw/get_all_child_jobs/${dataObject}?${buildApiSearchParams(params)}`
  );

  const json: ApiResponseWrapper<ChildJobsResponse> = await response.json();

  return {
    ...json,
    data: json.data.map((d) => transformChildJob(d)),
  };
}
