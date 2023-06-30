import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Logo } from "../logo/Logo";

type Props = {
  message?: string;
  imageColor?: string;
  textColor?: string;
};

export function AuthLogoHeader({ message }: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      textAlign="center"
    >
      <Box maxWidth="90%" width={{ xs: "280px", md: "340px" }}>
        <Logo variant="inline" width="100%" imageColor="#002DF3" />
      </Box>
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
