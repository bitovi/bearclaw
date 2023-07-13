import Box from "@mui/material/Box";

type Props = {
  children?: React.ReactNode;
};

export function Page({ children }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      {children}
    </Box>
  );
}
