import React from "react";
import type { TextFieldProps } from "@mui/material/TextField";
import { TextInput } from "~/components/input";

interface CodeInputBoxProps extends Omit<Partial<TextFieldProps>, "onKeyDown"> {
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}
export const CodeInputBox = React.forwardRef<
  HTMLInputElement,
  CodeInputBoxProps
>((props, ref) => {
  const { onKeyDown, ...textInputProps } = props;
  return (
    <TextInput
      inputRef={ref}
      variant="standard"
      autoComplete="off"
      inputProps={{
        placeholder: "-",
        onKeyDown,
        required: true,
        sx: {
          textAlign: "center",
          "&[type=number]": {
            MozAppearance: "textfield",
          },
          "&::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
        },
        type: "number",
      }}
      InputProps={{
        disableUnderline: true,
        sx: {
          color: "#FFF",
        },
      }}
      sx={{
        width: "56px",
        height: "56px",
        display: "flex",
        flexDirection: "row",
        borderRadius: "8px",
        border: "1px solid #FFF",
        color: "#FFF",
      }}
      {...textInputProps}
    />
  );
});
