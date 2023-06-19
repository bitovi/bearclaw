import { useNavigate, useSearchParams } from "@remix-run/react";
import { buildNewSearchParams } from "~/utils/buildNewSearchParams";
import { parseSortParam } from "~/utils/parseSortParam";

/**
 * Convenience hook to provide Sorting functionality off the URL.
 * The sortQuery return function accepts an option 'oneParam' flag, necessary to reuse this logic between API and Prisma, since Prisma can only accept 1 sorting query
 * @param pathname if query params should trigger navigation to route other than the current one
 * @returns
 */
export function useSorting(pathname?: string) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentSort = parseSortParam(searchParams.get("sort")) || {};

  const path = pathname ? `${pathname}?` : `?`;

  const sortQuery = (sortValue: string | undefined, oneParam = true) => {
    if (!sortValue) return;

    let newSort: Record<string, "asc" | "desc">;
    if (oneParam) {
      newSort = {
        [sortValue]: currentSort?.[sortValue] === "asc" ? "desc" : "asc",
      };
    } else {
      newSort = {
        ...currentSort,
        [sortValue]: currentSort?.[sortValue] === "asc" ? "desc" : "asc",
      };
    }

    const sortString = Object.entries(newSort)
      .map(([key, value]) => {
        if (value === "desc") return `-${key}`;
        return key;
      })
      .join(",");

    const updatedSearchParams = buildNewSearchParams(searchParams, {
      sort: sortString,
    });

    navigate(`${path}${updatedSearchParams}`);
  };

  return { sortQuery, currentSort };
}
