import { Card as MUICard, Box, Typography, CardActions } from "@mui/material";
import type { ButtonProps, BoxProps } from "@mui/material";
import { Button } from "~/components/button";
import StarIcon from "@mui/icons-material/Star";

const Card = ({
  title,
  CTA,
  star = false,
  containerStylings = {},
  additionalDetails = [],
  handleClick,
}: {
  title: string;
  CTA: {
    action?: () => void;
    label: string;
    variant?: ButtonProps["variant"];
  };
  star?: boolean;
  containerStylings?: BoxProps;
  additionalDetails?: string[];
  handleClick?: () => void;
}) => {
  return (
    <MUICard component={Box} flex={1} maxWidth="350px">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="space-between"
        padding={2}
        minHeight="150px"
        sx={containerStylings}
      >
        <Box flexDirection="column" paddingRight={2}>
          <Box paddingBottom={3} textAlign="left">
            <Typography variant="h5" color="text.primary">
              {title}
            </Typography>

            {additionalDetails.map((detail, i) =>
              detail ? (
                <Typography
                  key={`${detail.slice(0, 3)}-${i}`}
                  variant="body2"
                  color="text.secondary"
                >
                  {detail}
                </Typography>
              ) : null
            )}
          </Box>

          <CardActions sx={{ padding: 0 }}>
            <Button
              onClick={handleClick}
              variant={CTA.variant || "buttonLarge"}
            >
              {CTA.label}
            </Button>
          </CardActions>
        </Box>

        {star && (
          <Box paddingTop={3} justifySelf={"flex-end"} color="action.active">
            <StarIcon color="inherit" />
          </Box>
        )}
      </Box>
    </MUICard>
  );
};

export default Card;
