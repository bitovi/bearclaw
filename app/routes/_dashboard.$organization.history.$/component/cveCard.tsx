import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import { useRef } from "react";
import { SeverityTab } from "./severityTab";
import { usePageCopy } from "~/routes/_dashboard/copy";
import type { CveData } from "~/models/rsbomTypes";
import Skeleton from "@mui/material/Skeleton";

interface CVECardProps {
  name: string;
  rating?: CveData["rating"];
  score?: CveData["score"];
  subcomponentCount?: number;
  date?: string;
  description?: string;
  onCheck?: (checked: boolean) => void;
  onRowClick?: (id: string) => void;
  orientation?: "row" | "column";
}

export function SkeletonCard() {
  return (
    <Card elevation={1}>
      <Stack direction="row">
        <Stack direction="row">
          <Stack gap={1} paddingLeft={0.5} direction={"column"}>
            <Typography variant="subtitle1">
              <Skeleton width="126px" variant="text" animation="wave" />
            </Typography>
            <Typography variant="caption">
              <Skeleton width="126px" variant="text" animation="wave" />
            </Typography>
          </Stack>
        </Stack>
        <Stack
          padding="0px 16px 0px 48px"
          direction={"column"}
          gap="8px"
          alignItems="flex-start"
          flex="1 0 0"
          alignSelf="stretch"
          paddingBottom={1}
        >
          <Typography variant="subtitle1">
            <Skeleton width="75px" variant="text" animation="wave" />
          </Typography>
          <Typography variant="caption">
            <Skeleton width="400px" variant="text" animation="wave" />
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export function CVECard({
  name,
  rating,
  score,
  subcomponentCount,
  date,
  description,
  onRowClick = () => {},
  onCheck = () => {},
  orientation = "row",
}: CVECardProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const copy = usePageCopy("detail");

  return (
    <Card
      elevation={1}
      sx={{
        "&:hover": {
          backgroundColor: "#E0E0E0",
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
            {rating && score && (
              <SeverityTab
                rating={rating}
                score={score}
                padding="0px 8px 0px 16px"
                height="46px"
                width="45px"
                borderRadius="0px 0px 20px 0px"
                position="center"
              />
            )}
            <Stack
              alignItems={orientation === "row" ? "center" : ""}
              gap={1}
              paddingLeft={0.5}
              paddingTop={orientation === "column" ? 0.5 : 0}
              direction={orientation}
              data-testid="cve-card-oriented"
            >
              <Typography color="text.primary" variant="subtitle2">
                {name}
              </Typography>
              {score && (
                <Typography color="text.secondary" variant="subtitle2">
                  {score}
                </Typography>
              )}
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
          {date && (
            <Typography component={"p"} color="text.primary" variant="caption">
              {date}
            </Typography>
          )}
          {(!!subcomponentCount || subcomponentCount === 0) && (
            <Typography component={"p"} color="text.primary" variant="caption">
              {subcomponentCount} {copy?.content?.severeSubComponents}
            </Typography>
          )}
          {orientation === "column" && !!description && (
            <Typography
              component={Stack}
              color="text.primary"
              variant="caption"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {description}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
