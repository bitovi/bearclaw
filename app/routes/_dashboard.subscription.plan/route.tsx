import { Container, Box, Skeleton, Typography } from "@mui/material";

export default function Route() {
  return (
    <Container>
      <Skeleton
        animation={false}
        variant="rounded"
        width="100px"
        height="100px"
        sx={{ display: "flex" }}
        component={Box}
        justifyContent={"center"}
        alignItems="center"
      >
        <Typography component="span" visibility={"visible"}>
          Graphic
        </Typography>
      </Skeleton>
    </Container>
  );
}
