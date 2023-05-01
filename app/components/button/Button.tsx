import { Button as MuiButton } from "@mui/material";

type Props = React.ComponentProps<typeof MuiButton>;

export const Button: React.FC<Props> = ({
  children,
  ...props
}) => {

  return (
    <MuiButton {...props}>
      {children}
    </MuiButton>
  );
};
