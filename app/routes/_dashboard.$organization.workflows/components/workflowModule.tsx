import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ActionCard } from "./actionCard";
import { WorkflowProcess } from "../types";

export function WorkflowModule({
  title,
  workflowProcesses,
}: {
  title: string;
  workflowProcesses: WorkflowProcess[];
}) {
  return (
    <Stack width="358px" padding={4}>
      <Typography variant="h6" paddingBottom={2}>
        {title}
      </Typography>
      <Stack>
        {workflowProcesses.map((process, i) => {
          return (
            <ActionCard
              key={`${process.title}-${i}`}
              title={process.title}
              type={process.type}
              options={process.options}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
