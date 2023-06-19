import { useSearchParams, useNavigate } from "@remix-run/react";
import { useRef } from "react";
import { buildNewSearchParams } from "~/utils/buildNewSearchParams";
import { parseFilterParam } from "~/utils/parseFilterParam";

export function useFiltering(pathname?: string) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { _searchField, _searchString } = parseFilterParam(
    searchParams.get("filter")
  );
  const refTimer = useRef<NodeJS.Timeout | null>(null);

  const path = pathname ? `${pathname}?` : `?`;

  const debounceFilterQuery = ({
    searchString,
    searchField,
  }: {
    searchString?: string | undefined;
    searchField?: string | undefined;
  }) => {
    const toSearchString =
      searchString === "" || !!searchString
        ? searchString
        : _searchString || "";

    const toSearchField =
      searchField === "" || !!searchField ? searchField : _searchField || "";

    const updatedSearchParams = buildNewSearchParams(searchParams, {
      filter: `contains(${toSearchField},${toSearchString})`,
    });

<<<<<<< HEAD
    clearTimeout(refTimer.current || undefined);
    refTimer.current = setTimeout(
      () => navigate(`${path}${updatedSearchParams}`),
      500
    );
=======
    if (!refTimer.current) {
      refTimer.current = setTimeout(
        () => navigate(`${path}${updatedSearchParams}`),
        500
      );
    } else {
      clearTimeout(refTimer.current);
      refTimer.current = setTimeout(
        () => navigate(`${path}${updatedSearchParams}`),
        500
      );
    }
>>>>>>> dev
  };

  return {
    searchField: _searchField,
    searchString: _searchString,
    debounceFilterQuery,
  };
}
