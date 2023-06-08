export function buildNewSearchParams(
  searchParams: URLSearchParams,
  newValues: Record<string, string | number | null>
): string {
  const newSearchParams = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(newValues)) {
    if (value === null) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value.toString());
    }
  }
  return newSearchParams.toString();
}
