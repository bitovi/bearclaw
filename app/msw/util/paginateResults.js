module.exports = function paginateResults(data, url) {
  const offset = parseInt(url.searchParams.get("page[offset]"));
  const limit = parseInt(url.searchParams.get("page[limit]"));
  const perPage = limit || 10;

  return {
    data: data?.slice(offset || 0, offset + limit || 10),
    metadata: {
      page: {
        "current-page": Math.floor(offset / perPage + 1),
        "per-page": limit,
        total: data.length,
        "last-page": Math.ceil(data.length / perPage),
      },
    },
  };
};
