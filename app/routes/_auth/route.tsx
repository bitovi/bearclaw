import type { V2_MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Box, Divider, Typography } from "@mui/material";

export const meta: V2_MetaFunction = () => [
  {
    title: "Authentication",
  },
];

export default function Index() {
  return (
    <Box
      component="main"
      display="flex"
      flexDirection={{ xs: "column-reverse", md: "row" }}
      justifyContent="center"
      alignItems="stretch"
      height={{ xs: "auto", md: "100%" }}
      width="100%"
    >
      <Box
        position="relative"
        flex="1"
        width="100%"
        maxWidth="480px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        overflow="hidden"
        paddingRight="16px"
        sx={{
          color: "white",
          background: "linear-gradient(167.62deg, #192869 19.38%, #0B1433 101.5%)",
        }}
      >
        <Box
          position="absolute"
          borderRadius="12px"
          width="200px"
          height="240px"
          left="-150px"
          top="-40px"
          sx={{
            background: "#3507EE",
            transform: "rotate(18deg)"
          }}
        />
        <Box
          position="absolute"
          borderRadius="12px"
          width="200px"
          height="240px"
          left="-150px"
          bottom="-40px"
          sx={{
            background: "#420BD8",
            transform: "rotate(-18deg)"
          }}
        />
        <Box
          position="relative"
          margin={{ xs: "3rem", md: "3rem 3rem 3rem 6rem" }}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography fontWeight="400" fontSize="1.5rem">
            Value Prop Title
          </Typography>
          <Typography fontWeight="400" fontSize="1rem">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod .
          </Typography>
          <img
            style={{ borderRadius: "1rem" }}
            src="https://placehold.co/320x220?text=Placeholder Image"
            alt="Dashboard"
          />

          <Divider />

          <Typography fontWeight="400" fontSize="1.5rem">
            BEARCLAW Premium
          </Typography>
          <Typography fontWeight="400" fontSize="1rem">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
          </Typography>
        </Box>
      </Box>
      <Box
        flex="2"
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginLeft="-16px"
        zIndex="2"
        sx={{
          backgroundColor: "white",
          borderTopLeftRadius: "16px 24px",
          borderBottomLeftRadius: "16px 24px"
        }}
      >
        <Box maxWidth="700px" padding={{ xs: "5rem 1rem", md: "unset" }}>
          <Outlet />
        </Box>
      </Box>
      <Box
        position="relative"
        flex="1"
        width="100%"
        display={{ xs: "flex", md: "none" }}
        padding="0.5rem 1rem"
        alignItems="center"
        sx={{
          color: "white",
          background:
            "linear-gradient(167.62deg, #192869 19.38%, #0B1433 101.5%)",
        }}
      >
        <Typography fontWeight={700} fontSize="1.4rem">BEARCLAW</Typography>
      </Box>
    </Box>
  );
}
