const cloneDeep = require("lodash/cloneDeep");

function parseSortParam(sortString) {
  if (!sortString) return undefined;
  const fields = sortString.split(",");

  let obj = {};
  for (const field of fields) {
    if (field.startsWith("-")) {
      obj[field.slice(1)] = "desc";
    } else {
      obj[field] = "asc";
    }
  }
  // { [sortField]: 'asc' | 'desc' }
  return obj;
}

function fieldSorter(fields) {
  return function (a, b) {
    return fields
      .map(function (o) {
        var dir = 1;
        if (o[0] === "-") {
          dir = -1;
          o = o.substring(1);
        }
        if (a[o] > b[o]) return dir;
        if (a[o] < b[o]) return -dir;
        return 0;
      })
      .reduce(function firstNonZeroValue(p, n) {
        return p ? p : n;
      }, 0);
  };
}

module.exports = function sortResults(data, url) {
  const sort = parseSortParam(url.searchParams.get("sort"));
  if (!sort) return data;
  const clonedData = cloneDeep(data);
  const fields = Object.entries(sort).map(([key, value]) => {
    if (value === "desc") return `-${key}`;
    return key;
  });
  return clonedData.sort(fieldSorter(fields));
};
