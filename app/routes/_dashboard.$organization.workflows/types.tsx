import InputTwoToneIcon from "@mui/icons-material/InputTwoTone";
import CodeOffTwoToneIcon from "@mui/icons-material/CodeOffTwoTone";
import StorageTwoToneIcon from "@mui/icons-material/StorageTwoTone";

export type Action = {
  description: string;
  id: string;
};

export const WorkflowIconEnum = {
  INPUT: <InputTwoToneIcon sx={{ color: "#26C6DA" }} />,
  ACCESS: <StorageTwoToneIcon sx={{ color: "#26C6DA" }} />,
  ACTION: <CodeOffTwoToneIcon sx={{ color: "#26C6DA" }} />,
};

export type WorkflowProcess = {
  title: string;
  type: keyof typeof WorkflowIconEnum;
  options: Action[];
};
