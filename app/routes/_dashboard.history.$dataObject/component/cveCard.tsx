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
  onCheck?: (checked: boolean) => void;
  onRowClick?: (id: string) => void;
  orientation?: "row" | "column";
}

export function CVECard({
  name,
  rating,
  subcomponentCount,
  date,
  description,
  onRowClick = () => {},
  onCheck = () => {},
  orientation = "row",
}: CVECardProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  return (
    <Card
      elevation={1}
      sx={{
        "&:hover": {
          backgroundColor: "primary.states.focusVisible",
        },
      }}
      onClick={(e) => {
        if (e.target !== checkboxRef.current) {
          onRowClick(name);
        }
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
            <SeverityTab
              rating={rating}
              padding="0px 8px 0px 16px"
              height="46px"
              width="45px"
              borderRadius="0px 0px 20px 0px"
              position="center"
            />
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

          <Checkbox
            inputRef={checkboxRef}
            onChange={(e) => onCheck?.(e.target.checked)}
          />
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
