import type { ReactNode } from "react";
import Box from "@mui/material/Box";

type Props = {
  children: ReactNode;
  navigation?: ReactNode;
};

export function InnerPage({ children, navigation }: Props) {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      gap="1.5rem"
    >
      {navigation ? <Box flex="2">{navigation}</Box> : null}
      <Box flex="10" overflow="hidden auto">
        {children}
      </Box>
    </Box>
  );
}
