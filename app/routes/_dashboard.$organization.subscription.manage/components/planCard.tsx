import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type PlanCardProps = {
  planName: string;
  price: string;
  description: string;
  featureList: string[];
  selected?: boolean;
  handleClick: () => void;
};

const PlanCard = ({
  planName,
  price,
  description,
  featureList,
  selected = false,
  handleClick,
}: PlanCardProps) => {
  return (
    <Card sx={{ zIndex: 1 }} onClick={handleClick}>
      <Stack
        padding={2}
        display="flex"
        direction="row"
        color="rgba(0, 0, 0, 0.04)"
        bgcolor={selected ? "primary.states.focusVisible" : ""}
      >
        <Stack
          direction="row"
          flex={1}
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h5" color="text.primary" paddingLeft={1}>
              {planName}
            </Typography>
          </Box>

          {selected && (
            <Box color="primary.main">
              <CheckCircleIcon />
            </Box>
          )}
        </Stack>
      </Stack>
      <Divider />

      <Stack padding={2}>
        <Box paddingBottom={1}>
          <Typography variant="h4" component="span">
            {price}
          </Typography>
          <Typography variant="body1" color="text.secondary" component="span">
            {" "}
            Per month
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Box>
          {featureList.map((str, i) => {
            return (
              <Box
                display="flex"
                key={str.slice(0, 3) + `-${i}`}
                color="action.active"
              >
                <StarIcon />
                <Typography
                  paddingLeft={2}
                  variant="body1"
                  color="text.primary"
                >
                  {str}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Card>
  );
};

export default PlanCard;
