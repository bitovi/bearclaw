import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

export type InputProps = Omit<TextFieldProps, "error"> & {
  error?: boolean | string | null;
};

export const TextInput: React.FC<InputProps> = ({
  error,
  inputRef,
  ...props
}) => {
  const hasError = typeof error === "string" ? error.length > 0 : !!error;

  return (
    <TextField
      error={hasError}
      helperText={hasError ? error : null}
      {...props}
      inputRef={inputRef}
    />
  );
};
