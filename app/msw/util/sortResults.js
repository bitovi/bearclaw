const cloneDeep = require("lodash/cloneDeep");

/**
 * Takes the "sort" query paramter from a URL and builds an object
 * from it whose keys are the specified fields and values are
 * either "asc" or "desc" depending on the string, such as:
 *
 * { [sortField]: 'asc' | 'desc' }
 * @param {*} sortString the "sort" query paramter from a URL
 * @returns
 */
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
  return obj;
}

function _fieldSorter(fields) {
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

const compare = (a, b) => {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

function fieldSorter(fields) {
  return (a, b) => {
    return fields
      .map((fieldString) => {
        let dir = 1;
        if (fieldString[0] === "-") {
          dir = -1;
          fieldString = fieldString.substring(1);
        }
        return compare(a[fieldString], b[fieldString]);
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
