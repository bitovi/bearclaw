import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";

const FeatureBox = ({
  description,
  number,
}: {
  description: string;
  number: number;
}) => {
  return (
    <Stack direction="row" alignContent={"center"} paddingBottom={3}>
      <Box
        alignItems="center"
        display="flex"
        paddingRight={3}
        color="action.active"
      >
        <StarIcon color="inherit" />
      </Box>
      <Stack>
        <Typography paddingBottom={1} variant="h5" color="text.secondary">
          Feature {number}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default FeatureBox;
