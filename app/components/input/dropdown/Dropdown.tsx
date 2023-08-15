import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import type { SelectProps } from "@mui/material/Select";
import { useId } from "react";
import { OutlinedInput } from "@mui/material";

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
  placeholder?: string;
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
  placeholder,
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
        {...props}
        labelId={domId}
        id={`select-${domId}`}
        input={<OutlinedInput label={label} />}
      >
        {placeholder && (
          <MenuItem disabled key="placeholder" value="">
            {placeholder}
          </MenuItem>
        )}
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
