function parseFilterParam(filterParam) {
  // regex to return values within "contains(______,______)"
  // 0 index will be field, 1 index will be value
  const result = filterParam?.match(/\((.*?)\)/)?.[1].split(",");
  return {
    _searchField: result?.[0],
    _searchString: result?.[1],
  };
}

module.exports = function filterResults(data, url) {
  const { _searchField, _searchString } = parseFilterParam(
    url.searchParams.get("filter")
  );

  if (_searchField && _searchString) {
    const filteredList = data.filter((item) => {
      return item[_searchField]
        .toLowerCase()
        .includes(_searchString.toLowerCase());
    });
    return filteredList;
  }

  return data;
};
