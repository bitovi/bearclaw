import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";

import { Form } from "@remix-run/react";

import { useFiltering } from "~/hooks/useFiltering";
import { Dropdown, TextInput } from "~/components/input";
import type { DropdownOption } from "~/components/input";

export function NavigationFilter({
  dropdownOptions: _dropdownOptions,
  dropdownLabel,
  searchLabel,
}: {
  dropdownOptions: DropdownOption[];
  dropdownLabel: string;
  searchLabel: string;
}) {
  const { searchField, searchString, debounceFilterQuery } = useFiltering(
    undefined,
    true
  );

  const dropdownOptions = [{ value: "", label: "Select a Field" }].concat(
    _dropdownOptions
  );

  return (
    <Form action="" method="get">
      <Stack direction="row" gap={2} justifyContent="space-between">
        <TextInput
          name={searchLabel}
          inputProps={{
            sx: { maxHeight: "20px", size: "medium" },
          }}
          onChange={({ target }) =>
            debounceFilterQuery({ searchString: target.value, searchField })
          }
          label={searchLabel}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ marginRight: 1, color: "#000000" }} />
            ),
            sx: { height: "40px", borderRadius: "8px" },
          }}
          defaultValue={searchString || ""}
          sx={{
            color: "rgba(0, 0, 0, 0.23)",
            size: "medium",
          }}
        />
        {dropdownOptions.length && (
          <Dropdown
            fullWidth={false}
            onChange={({ target }) =>
              debounceFilterQuery({
                searchField: target.value as string,
                searchString,
              })
            }
            labelId={`filter-${dropdownLabel}-select-label`}
            id={`filter-${dropdownLabel}-select`}
            value={
              dropdownOptions.find((r) => r.value === searchField)?.value || ""
            }
            displayEmpty
            label={dropdownLabel} // To ensure MUI notched outline styling, we still need to pass a value to the label prop
            sx={{ height: "40px", borderRadius: "8px", size: "small" }}
            options={dropdownOptions}
          />
        )}
      </Stack>
    </Form>
  );
}
