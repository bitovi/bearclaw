import DashboardTwoToneIcon from "@mui/icons-material/DashboardTwoTone";
import WorkspacePremiumTwoToneIcon from "@mui/icons-material/WorkspacePremiumTwoTone";
import HistoryIcon from "@mui/icons-material/History";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import SchemaIcon from "@mui/icons-material/Schema";
import BiotechIcon from "@mui/icons-material/Biotech";
import LinkIcon from "@mui/icons-material/Link";
import SupportTwoToneIcon from "@mui/icons-material/SupportTwoTone";
import PersonSearchTwoToneIcon from "@mui/icons-material/PersonSearchTwoTone";
import PersonIcon from "@mui/icons-material/Person";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";
import AddchartTwoToneIcon from "@mui/icons-material/AddchartTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DocumentScannerTwoToneIcon from "@mui/icons-material/DocumentScannerTwoTone";

export const icons = {
  dashboard: <DashboardTwoToneIcon />,
  history: <HistoryIcon />,
  schema: <SchemaIcon />,
  biotech: <BiotechIcon />,
  link: <LinkIcon />,
  workspace: <WorkspacePremiumTwoToneIcon />,
  accountBox: <AccountBoxIcon />,
  support: <SupportTwoToneIcon />,
  logout: <LogoutIcon />,
  person: <PersonIcon />,
  personSearch: <PersonSearchTwoToneIcon />,
  infoOutlined: <InfoOutlinedIcon />,
  warning: <WarningAmberIcon />,
  check: <CheckIcon />,
  checkCircleOutline: <CheckCircleOutlineIcon />,
  starTwoTone: <StarTwoToneIcon />,
  addChartTwoTone: <AddchartTwoToneIcon />,
  search: <SearchTwoToneIcon />,
  homeWork: <HomeWorkIcon />,
  scanner: <DocumentScannerTwoToneIcon />,
} as const;

function isIcon(icon: string): icon is keyof typeof icons {
  return icon in icons;
}

type Props = {
  icon: string;
  fallback?: React.ReactNode;
};

export function IconFromString({ icon, fallback }: Props) {
  return <>{isIcon(icon) ? icons[icon] : fallback}</>;
}
