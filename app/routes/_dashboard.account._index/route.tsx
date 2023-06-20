import { Box, Stack, Typography } from "@mui/material";
import { FormCard } from "./components/formCard";
import accountQuestions from "./components/accountQuestions";

export default function Route() {
  return (
    <Box>
      <Box paddingLeft={2} paddingBottom={2}>
        <Typography variant="h5">Hello McUsername,</Typography>
        <Typography variant="body2" color="text.secondary">
          Update your personal details here
        </Typography>
      </Box>
      <Stack gap={2}>
        {accountQuestions.map((q, i) => {
          return (
            <FormCard key={`question-${i}`} question={q} submitText={"Save"} />
          );
        })}
      </Stack>
    </Box>
  );
}
