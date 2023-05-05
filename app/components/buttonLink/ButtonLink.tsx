import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import { Link } from "@remix-run/react";

type Props = ButtonProps & {
  to: string;
};

export function ButtonLink({ to, children, variant, sx }: Props) {
  return (
    <Button component={Link} to={to} variant={variant} sx={sx}>
      {children}
    </Button>
  );
}
