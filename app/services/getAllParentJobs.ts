// Example response
// {
//   "Date Analyzed": "2023-03-01 14:07:59.611000",
//   "Filename": "tdpServer",
//   "Size": 134064,
//   "Status": "complete",
//   "Type": "application/x-executable",
//   "_id": "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77"
// }

import dayjs from "dayjs";

type ParentJobResponse = {
  _id: string;
  "Date Analyzed": string;
  Filename: string;
  Size: number;
  Status: string;
  Type: string;
};

export type ParentJob = {
  _id: string;
  analyzedAt: string;
  filename: string;
  size: number;
  status: string; // TODO: make this an enum
  type: string; // TODO: make this an enum
};

function transformApiParentJob(job: ParentJobResponse): ParentJob {
  return {
    _id: job._id,
    analyzedAt: job["Date Analyzed"],
    filename: job.Filename,
    size: job.Size,
    status: job.Status,
    type: job.Type,
  };
}

export const getAllParentJobs = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<ParentJob[]> => {
  const response = await fetch(
    `${process.env.BEARCLAW_URL}/claw/get_all_parent_jobs?userId=${userId}&groupId=${organizationId}`
  );
  const data: ParentJobResponse[] = await response.json();
  return data.map((job) => transformApiParentJob(job))
};
