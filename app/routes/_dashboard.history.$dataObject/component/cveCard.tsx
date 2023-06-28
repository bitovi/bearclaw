import { Stack, Checkbox, Typography, Card } from "@mui/material";
import { useRef } from "react";
import { WarningText } from "../types";
import { rateSeverity } from "../utils/rateSeverity";
import { SeverityTab } from "./severityTab";

interface CVECardProps {
  name: string;
  rating: string;
  subcomponentCount: number;
  date: string;
  description: string;
  onChange?: (checked: boolean) => void;
  orientation?: "row" | "column";
}

export function CVECard({
  name,
  rating,
  subcomponentCount,
  date,
  description,
  onChange = () => {},
  orientation = "row",
}: CVECardProps) {
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <Card
      elevation={1}
      onClick={() => {
        checkBoxRef.current?.click();
      }}
      sx={{
        "&:hover": {
          backgroundColor: "primary.states.focusVisible",
        },
      }}
    >
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          alignSelf="stretch"
          justifyContent="space-between"
        >
          <Stack direction="row">
            <SeverityTab rating={rating} />
            <Stack
              alignItems={orientation === "row" ? "center" : ""}
              gap={1}
              paddingLeft={1}
              paddingTop={orientation === "column" ? 0.5 : 0}
              direction={orientation}
            >
              <Typography color="text.primary" variant="subtitle2">
                {name}
              </Typography>
              <Typography color="text.secondary" variant="subtitle2">
                {rating} {WarningText[rateSeverity(rating)]}
              </Typography>
            </Stack>
          </Stack>

          <Checkbox inputRef={checkBoxRef} onChange={handleChecked} />
        </Stack>
        <Stack
          padding="0px 16px 0px 48px"
          direction={orientation}
          gap="8px"
          alignItems="flex-start"
          flex="1 0 0"
          alignSelf="stretch"
          paddingBottom={1}
        >
          <Typography component={"p"} color="text.primary" variant="caption">
            {date}
          </Typography>
          <Typography component={"p"} color="text.primary" variant="caption">
            {subcomponentCount} Severe Sub-components
          </Typography>
          {orientation === "column" && (
            <Typography component={"p"} color="text.primary" variant="caption">
              {description}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
