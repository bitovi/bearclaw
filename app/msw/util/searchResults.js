module.exports = function searchResults(data, url) {
  const search = url.searchParams.get("search");

  if (search) {
    const filteredList = data.filter((item) => {
      return Object.keys(item).some(key => {
        return item[key]
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    });
    return filteredList;
  }

  return data;
};
