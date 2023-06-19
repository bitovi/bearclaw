import MuiButton from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";

type Props = ButtonProps;

export const Button: React.FC<Props> = ({ children, ...props }) => {
  return (
    <MuiButton disableRipple disableFocusRipple {...props}>
      {children}
    </MuiButton>
  );
};
