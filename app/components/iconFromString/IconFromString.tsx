import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import HistoryIcon from "@mui/icons-material/History";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import SchemaIcon from "@mui/icons-material/Schema";
import BiotechIcon from "@mui/icons-material/Biotech";
import LinkIcon from "@mui/icons-material/Link";
import SupportIcon from "@mui/icons-material/Support";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const icons = {
  dashboard: <DashboardIcon />,
  history: <HistoryIcon />,
  schema: <SchemaIcon />,
  biotech: <BiotechIcon />,
  link: <LinkIcon />,
  workspace: <WorkspacePremiumIcon />,
  accountBox: <AccountBoxIcon />,
  support: <SupportIcon />,
  logout: <LogoutIcon />,
  personSearch: <PersonSearchIcon />,
  infoOutlined: <InfoOutlinedIcon />,
  warning: <WarningAmberIcon />,
  check: <CheckIcon />,
  checkCircleOutline: <CheckCircleOutlineIcon />,
} as const;

function isIcon(icon: string): icon is keyof typeof icons {
  return icon in icons;
}

type Props = {
  icon: string;
  fallback?: React.ReactNode;
}

export function IconFromString({ icon, fallback }: Props) {
  return <>{isIcon(icon) ? icons[icon] : fallback}</>;
}