import type { ReactNode } from "react";
import Box from "@mui/material/Box";

type Props = {
  children: ReactNode;
  navigation?: ReactNode;
};

export function InnerPage({ children, navigation }: Props) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", lg: "2fr 10fr" }}
      gap="1.5rem"
      paddingBottom={8}
    >
      {navigation ? <Box>{navigation}</Box> : null}
      <Box overflow="hidden auto">{children}</Box>
    </Box>
  );
}
