export function parseSortParam(sortString: string | null) {
  if (!sortString) return undefined;
  const fields = sortString.split(",");

  let obj: Record<string, "asc" | "desc"> = {};
  for (const field of fields) {
    if (field.startsWith("-")) {
      obj[field.slice(1)] = "desc";
    } else {
      obj[field] = "asc";
    }
  }
  return obj;
}
