import {
  Card as MUICard,
  ButtonProps,
  BoxProps,
  Box,
  Typography,
  CardActions,
} from "@mui/material";
import { Button } from "~/components/button";
import StarIcon from "@mui/icons-material/Star";

const Card = ({
  title,
  CTA,
  star = false,
  containerStylings = {},
  additionalDetails = [],
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
}) => {
  return (
    <MUICard component={Box} flex={1}>
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
            <Typography variant="subtitle2">{title}</Typography>
            {additionalDetails.map((detail, i) =>
              detail ? (
                <Typography key={i} variant="body2">
                  {detail}
                </Typography>
              ) : null
            )}
          </Box>

          <CardActions sx={{ padding: 0 }}>
            <Button variant={CTA.variant || "contained"}>{CTA.label}</Button>
          </CardActions>
        </Box>

        {star && (
          <Box
            paddingTop={3}
            justifySelf={"flex-end"}
            color="rgba(0, 0, 0, 0.56)"
          >
            <StarIcon color="inherit" />
          </Box>
        )}
      </Box>
    </MUICard>
  );
};

export default Card;
