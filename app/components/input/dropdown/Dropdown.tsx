import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import type { SelectProps } from "@mui/material/Select";
import { useId } from "react";

export type DropdownOption = {
  value: string;
  label: string;
};

export type DropdownProps = Omit<SelectProps, "error"> & {
  label?: string;
  labelPosition?: number;
  error?: boolean | string | null;
  disabled?: boolean;
  fullWidth?: boolean;
  options: Array<{
    label?: string;
    value: string | number;
    selected?: boolean;
  }>;
};

export function Dropdown({
  label,
  value,
  options,
  disabled,
  error,
  labelPosition,
  fullWidth,
  ...props
}: DropdownProps) {
  const domId = useId();

  return (
    <FormControl fullWidth={fullWidth} disabled={disabled} error={!!error}>
      <InputLabel id={domId} sx={{ top: labelPosition || 0 }}>
        {label}
      </InputLabel>
      <Select
        labelId={domId}
        label={label}
        id={`select-${domId}`}
        defaultValue={options.find((o) => o.selected)?.value}
        value={value}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label || option.value}
          </MenuItem>
        ))}
      </Select>
      {error && typeof error === "string" && (
        <FormHelperText>Error</FormHelperText>
      )}
    </FormControl>
  );
}
