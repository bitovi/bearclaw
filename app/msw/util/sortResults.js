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
  return (a, b) => {
    return fields
      .map((fieldString) => {
        let dir = 1;
        if (fieldString[0] === "-") {
          dir = -1;
          fieldString = fieldString.substring(1);
        }
        if (a[fieldString] > b[fieldString]) return dir;
        if (a[fieldString] < b[fieldString]) return -dir;
        return 0;
      })
      .reduce((acc, curr) => {
        return acc ? acc : curr;
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
