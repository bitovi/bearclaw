import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

type Props = ButtonProps &
  Omit<LinkProps, "to"> & {
    to?: string;
  };

export function ButtonLink({
  to,
  children,
  variant,
  sx,
  prefetch,
  ...props
}: Props) {
  return (
    <Button
      disableRipple
      disableFocusRipple
      component={to ? Link : "div"}
      aria-disabled={!to}
      to={to}
      prefetch={prefetch ?? undefined}
      variant={variant}
      sx={{
        ...sx,
        cursor: to ? "pointer" : "not-allowed",
      }}
      aria-label={props["aria-label"]}
      title={
        props.title ||
        (props["aria-label"] && props["aria-label"].toUpperCase())
      }
    >
      {children}
    </Button>
  );
}
