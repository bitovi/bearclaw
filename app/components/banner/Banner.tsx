import MuiSnackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import type { AlertProps } from "@mui/material/Alert";
import MuiAlertTitle from "@mui/material/AlertTitle";

import type { SnackbarProps } from "@mui/material/Snackbar";
import React from "react";

type Props = {
  title?: string;
  content?: string;
  container?: Omit<SnackbarProps, "children">;
  alert?: Omit<AlertProps, "children">;
  children?: React.ReactElement<any, any>;
};

export const Banner: React.FC<Props> = ({
  children,
  container,
  alert,
  title,
  content,
}) => {
  const containerProps = {
    ...container,
  };
  const alertProps: Omit<AlertProps, "children"> = {
    severity: "error",
    variant: "filled",
    ...alert,
  };
  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      {...containerProps}
    >
      <MuiAlert {...alertProps}>
        {title && <MuiAlertTitle>{title}</MuiAlertTitle>}
        {content && content}
        {children}
      </MuiAlert>
    </MuiSnackbar>
  );
};
