export type ApiResponseWrapper<T> = {
  data: T;
  metadata?: {
    totalFilesAnalyzed: number;
    totalVulnerabilitiesCaptured: number;
    numberofCritialWarnings: number;
    page: {
      "current-page": number;
      "per-page": number;
      total: number;
      "last-page": number;
    };
  };
  processingTime: number;
};

export type ApiRequestParams = {
  userId?: string | null;
  organizationId?: string | null;
  page?: string | null;
  perPage?: string | null;
  filter?: string | null;
  sort?: string | null;
  search?: string | null;
};

export function buildApiSearchParams(params: ApiRequestParams): string {
  const searchParams: string[] = [];
  if (params.userId) searchParams.push(`userId=${params.userId}`);
  if (params.organizationId)
    searchParams.push(`groupId=${params.organizationId}`);
  if (params.filter) searchParams.push(`filter=${params.filter}`);
  if (params.page && params.perPage) {
    const page = parseInt(params.page) || 1;
    const perPage = parseInt(params.perPage) || 10;
    const offset = (page - 1) * perPage;
    searchParams.push(`page[offset]=${offset}`);
    searchParams.push(`page[limit]=${perPage}`);
  }
  if (params.sort) {
    searchParams.push(`sort=${params.sort}`);
  }
  if (params.search) {
    searchParams.push(`search=${params.search}`);
  }
  return searchParams.join("&");
}
