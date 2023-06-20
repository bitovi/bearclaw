import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { Dropdown, TextInput } from "~/components/input";
import { questions as _questions } from "~/routes/_auth.onboarding/questions";

export function FormCard({
  question,
  submitText,
}: {
  question: (typeof _questions)[number];
  submitText: string;
}) {
  return (
    <Card variant="outlined" sx={{ padding: 2, paddingBottom: 0 }}>
      <Box paddingBottom={2}>
        <Typography variant="h6" color="text.secondary">
          {question.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {question.description}
        </Typography>
      </Box>

      <Stack
        display={question.questions.length > 1 ? "grid" : "block"}
        gridTemplateColumns={
          question.questions.length > 1
            ? { xs: "1fr", md: "repeat(2, 1fr)" }
            : {}
        }
        gap={2}
      >
        {question.questions.map((formQuestion) => (
          <div key={formQuestion.name}>
            {formQuestion.type === "text" && (
              <TextInput
                fullWidth
                label={formQuestion.label}
                name={formQuestion.name}
                required={formQuestion.required}
                disabled={formQuestion.disabled}
              />
            )}
            {formQuestion.type === "select" && (
              <Dropdown
                fullWidth
                variant="filled"
                labelPosition={10}
                label={formQuestion.label}
                name={formQuestion.name}
                required={formQuestion.required}
                options={formQuestion.options}
                disabled={formQuestion.disabled}
              />
            )}
          </div>
        ))}
      </Stack>

      <Stack
        padding={1}
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Button>{submitText}</Button>
      </Stack>
    </Card>
  );
}
