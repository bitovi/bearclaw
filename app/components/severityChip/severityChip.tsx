import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import ErrorOutlineTwoToneIcon from "@mui/icons-material/ErrorOutlineTwoTone";
import WarningAmberTwoToneIcon from "@mui/icons-material/WarningAmberTwoTone";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

const severityOptions = [
  {
    value: "Unknown",
    icon: <InfoOutlinedIcon sx={{ fill: "#29B6F6" }} />,
  },
  {
    value: "Passed",
    icon: <CheckCircleOutlineTwoToneIcon sx={{ fill: "#66BB6A" }} />,
  },
  {
    value: "Critical",
    icon: <ErrorOutlineTwoToneIcon sx={{ fill: "#F44336" }} />,
  },
  {
    value: "High",
    icon: <WarningAmberTwoToneIcon sx={{ fill: "#FFA726" }} />,
  },
  {
    value: "Medium",
    icon: <WarningAmberTwoToneIcon sx={{ fill: "#FFA726" }} />,
  },
  {
    value: "Low",
    icon: <WarningAmberTwoToneIcon sx={{ fill: "#FFA726" }} />,
  },
] as const;

const isSeverityOption = (
  key: any
): key is (typeof severityOptions)[number]["value"] => {
  return (
    typeof key === "string" && severityOptions.some((opt) => opt.value === key)
  );
};

export default function SeverityChip({ severity }: { severity: any }) {
  if (!isSeverityOption(severity)) return null;
  const option = severityOptions.find((opt) => opt.value === severity);
  return (
    <Chip
      sx={{ backgroundColor: "background.paper", borderRadius: 0 }}
      avatar={option?.icon}
      label={
        <Typography color="text.primary" variant="body2">
          {option?.value}
        </Typography>
      }
      variant="filled"
    />
  );
}
