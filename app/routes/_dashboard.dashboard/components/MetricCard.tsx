import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FolderIcon } from "./FolderIcon.svg";
import { ShieldIcon } from "./ShieldIcon.svg";
import { WarningIcon } from "./WarningIcon.svg";
import { Link } from "@remix-run/react";
import background from "./background.png";

const variants = {
  files: {
    icon: <FolderIcon />,
    background: `linear-gradient(189deg, rgba(0, 25, 48, 0.80) 17.19%, rgba(0, 180, 104, 0.72) 100%)`,
  },
  vulnerabilities: {
    icon: <ShieldIcon />,
    background: `linear-gradient(189deg, rgba(0, 12, 122, 0.90) 0%, rgba(136, 0, 82, 0.72) 100%)`,
  },
  cves: {
    icon: <WarningIcon />,
    background: `linear-gradient(189deg, rgba(177, 0, 0, 0.80) 0%, rgba(228, 178, 0, 0.64) 100%)`,
  },
};

type Props = {
  variant: keyof typeof variants;
  count?: number;
  message: string;
  to: string;
};

export const MetricCard = ({ variant, count, message, to }: Props) => {
  return (
    <Box
      component={Link}
      to={to}
      padding="1rem"
      display="flex"
      gap={1}
      justifyContent="center"
      flexDirection="column"
      borderRadius="20px"
      sx={{
        background: variants[variant].background,
        textDecoration: "none",
      }}
      position="relative"
    >
      <Box
        component="img"
        src={background}
        position="absolute"
        top="0"
        left="0"
        height="100%"
        width="100%"
        sx={{ objectFit: "cover", opacity: 0.7, mixBlendMode: "color-burn" }}
      />
      <Box display="flex" width="100%">
        <Box display="flex" width="4.5rem">
          {variants[variant].icon}
        </Box>
        <Typography flex="1" variant="h2" color="white">
          {count?.toLocaleString()}
        </Typography>
      </Box>
      <Typography variant="subtitle2" color="white">
        {message}
      </Typography>
    </Box>
  );
};
