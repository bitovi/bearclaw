import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import type { CheckboxProps } from "@mui/material";

type Props = CheckboxProps & {
  label?: string;
};

export function Checkbox(props: Props) {
  const { label, ...restOfProps } = props;

  return (
    <FormControlLabel
      control={<MuiCheckbox defaultChecked {...restOfProps} />}
      label={label}
    />
  );
}
