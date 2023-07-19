import { useSearchParams, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { buildNewSearchParams } from "~/utils/buildNewSearchParams";
import { parseFilterParam } from "~/utils/parseFilterParam";

export function useFiltering(pathname?: string, includeSearchField?: boolean) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { _searchField, _searchString } = parseFilterParam(
    searchParams.get("filter")
  );

  const [searchField, setSearchField] = useState(_searchField);
  const [searchString, setSearchString] = useState(_searchString);
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
    let toSearchField;

    setSearchString(toSearchString);

    if (includeSearchField) {
      toSearchField =
        searchField === "" || !!searchField ? searchField : _searchField || "";
      setSearchField(toSearchField);

      if (!toSearchField) return;
      if (!toSearchString && !_searchString && toSearchField) return;
    }

    const updatedSearchParams = buildNewSearchParams(searchParams, {
      filter: `contains(${toSearchField},${toSearchString})`,
    });

    clearTimeout(refTimer.current || undefined);
    refTimer.current = setTimeout(
      () => navigate(`${path}${updatedSearchParams}`),
      500
    );
  };

  return {
    searchField,
    searchString,
    debounceFilterQuery,
  };
}
