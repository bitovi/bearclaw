import Box from "@mui/material/Box";

type Props = {
  children?: React.ReactNode;
};

export function Page({ children }: Props) {
  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      gap="2rem"
      justifyContent="stretch"
      height="100%"
    >
      {children}
    </Box>
  );
}
