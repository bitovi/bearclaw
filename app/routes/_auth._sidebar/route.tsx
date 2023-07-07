import { Outlet, useLocation } from "@remix-run/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PortableText } from "@portabletext/react";
import { useParentSidebarCopy } from "../_auth/copy";
import { json } from "@remix-run/server-runtime";
import { Carousel } from "~/components/carousel";
import {
  SideBarImage,
  SideBarImage2,
  SideBarImage3,
} from "~/components/authSidebarImages";
import { Logo } from "~/components/logo/Logo";

export async function loader() {
  return json({});
}

function ImageCarouselDisplay() {
  const copy = useParentSidebarCopy();
  return (
    <Stack
      position="relative"
      padding={{ xs: "3rem", lg: "3rem 3rem 3rem 6rem" }}
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      {/* TODO: Implement images in CMS 
          https://usa-vbt.atlassian.net/browse/BA-166?atlOrigin=eyJpIjoiZTRkMTY5MzY1ODFkNGQ2ZmFiOTY2NDA5MjgzZDBmNjciLCJwIjoiaiJ9
          */}
      <Stack alignItems="center" width="320" height="210">
        <Carousel images={[SideBarImage, SideBarImage, SideBarImage]} />
      </Stack>
      <Box paddingTop={4}>
        <PortableText value={copy?.content} />
      </Box>
    </Stack>
  );
}

function ImageSpreadDisplay() {
  return (
    <Stack
      height="100%"
      width="100%"
      alignItems="center"
      justifyItems="center"
      justifyContent="center"
      paddingLeft={{ sm: 0, lg: 6 }}
      paddingTop={{ sm: 4, lg: 0 }}
    >
      <Stack
        height="100%"
        width="100%"
        alignItems="center"
        justifyItems="center"
        justifyContent="center"
        paddingX={{ sm: 0, lg: 7 }}
      >
        <Box paddingBottom={3}>
          <Logo variant="imageOnly" />
        </Box>
        <Box
          height={{ xs: "300px", lg: "50%" }}
          width={{ xs: "300px", lg: "100%" }}
          position="relative"
        >
          <Box
            position="absolute"
            top={{ xs: 0, lg: 0 }}
            left={{ xs: -20, lg: -55 }}
          >
            <SideBarImage />
          </Box>
          <Box
            position="absolute"
            right={{ xs: "unset", lg: -25 }}
            left={{ xs: 30, lg: "unset" }}
            top={{ xs: 40, lg: 135 }}
          >
            <SideBarImage2 />
          </Box>
          <Box
            position="absolute"
            top={{ xs: 140, lg: 265 }}
            left={{ xs: -20, lg: -60 }}
          >
            <SideBarImage3 />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default function Index() {
  const location = useLocation();
  return (
    <Box
      component="main"
      display="flex"
      flexDirection={{ xs: "column-reverse", lg: "row" }}
      justifyContent="center"
      alignItems="stretch"
      height={{ xs: "auto", lg: "100%" }}
      minHeight="100%"
      width="100%"
    >
      <Box
        position="relative"
        flex="1"
        width="100%"
        maxWidth={{ xs: "unset", lg: "480px" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        overflow="hidden"
        sx={{
          color: "white",
          background:
            "linear-gradient(167.62deg, #192869 19.38%, #0B1433 101.5%)",
        }}
      >
        <Box
          position="absolute"
          borderRadius="12px"
          width="200px"
          height="240px"
          left="-150px"
          top="-46px"
          sx={{
            backgroundColor: "#3507EE",
            transform: "rotate(18deg)",
          }}
        />
        <Box
          position="absolute"
          borderRadius="12px"
          width="200px"
          height="240px"
          right="-148px"
          bottom="-44px"
          sx={{
            backgroundColor: "#420BD8",
            transform: "rotate(18deg)",
          }}
        />
        {location.pathname.includes("onboarding") ? (
          <ImageSpreadDisplay />
        ) : (
          <ImageCarouselDisplay />
        )}
      </Box>
      <Box
        flex="2"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "white",
        }}
      >
        <Box maxWidth="700px" padding={{ xs: "5rem 1rem", lg: "unset" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
