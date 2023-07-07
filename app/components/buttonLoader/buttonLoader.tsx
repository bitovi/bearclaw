import LoadingButton from "@mui/lab/LoadingButton";
import type { LoadingButtonProps } from "@mui/lab/LoadingButton";

export function ButtonLoader({ children, ...props }: LoadingButtonProps) {
  return <LoadingButton {...props}>{children}</LoadingButton>;
}
