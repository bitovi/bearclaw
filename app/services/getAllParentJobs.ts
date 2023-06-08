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

type ParentJobResponse = {
  data: Array<{
    _id: string;
    dateAnalyzed: string;
    filename: string;
    size: number;
    status: string;
    type: string;
  }>
};

export type ParentJob = {
  _id: string;
  analyzedAt: string;
  filename: string;
  size: number;
  status: string; // TODO: make this an enum
  type: string; // TODO: make this an enum
};

function transformApiParentJob(job: ParentJobResponse["data"][number]): ParentJob {
  return {
    _id: job._id,
    analyzedAt: job.dateAnalyzed,
    filename: job.filename,
    size: job.size,
    status: job.status,
    type: job.type,
  };
}

export const getAllParentJobs = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<ParentJob[]> => {
  try {
    const response = await fetch(
      `${process.env.BEARCLAW_URL}/claw/get_all_parent_jobs?userId=${userId}&groupId=${organizationId}`
    );
    const data: ParentJobResponse["data"] = await response.json();
    return data.map((job) => transformApiParentJob(job))
  } catch (error) {
    console.error(error);
    return [];
  }
};
