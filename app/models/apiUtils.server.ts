export type ApiResponseWrapper<T> = {
  data: T,
  metadata: {
    totalFilesAnalyzed: number,
    totalVulnerabilitiesCaptured: number,
    numberofCritialWarnings: number,
    page: {
      "current-page": number,
      "per-page": number,
      "total": number,
      "last-page": number
    }
  },
  processingTime: number
};

export type ApiRequestParams = {
  userId?: string | null;
  organizationId?: string | null;
  page?: string | null;
  perPage?: string | null;
};

export function buildApiSearchParams(params: ApiRequestParams): string {
  const searchParams: string[] = [];
  if (params.userId) searchParams.push(`userId=${params.userId}`);
  if (params.organizationId)
    searchParams.push(`groupId=${params.organizationId}`);
  if (params.page && params.perPage) {
    const offset = parseInt(params.page) * parseInt(params.perPage);
    searchParams.push(`page[offset]=${offset}`);
    searchParams.push(`page[limit]=${params.perPage}`);
  }
  return searchParams.join("&");
}
