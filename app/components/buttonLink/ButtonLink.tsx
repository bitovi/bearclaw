import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import { Link } from "@remix-run/react";

type Props = ButtonProps & {
  to?: string;
};

export function ButtonLink({ to, children, variant, sx, ...props }: Props) {
  return (
    <Button
      component={to ? Link : "div"}
      aria-disabled={!to}
      to={to}
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
