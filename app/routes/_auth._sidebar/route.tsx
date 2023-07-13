import { Outlet, useLocation } from "@remix-run/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PortableText } from "@portabletext/react";
import { useParentImageCopy, useParentSidebarCopy } from "../_auth/copy";
import { json } from "@remix-run/server-runtime";
import { Carousel } from "~/components/carousel";
import { useMemo } from "react";
import type { AuthImages } from "../_auth/types";
import { Logo } from "~/components/logo/Logo";

export async function loader() {
  return json({});
}

function ImageSpreadDisplay({ images }: { images: AuthImages["imageURLs"] }) {
  const image1 = images[0];
  const image2 = images[1];
  const image3 = images[2];
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
          height={{ xs: "300px", lg: "500px" }}
          width={{ xs: "300px", lg: "100%" }}
          position="relative"
        >
          <Box
            position="absolute"
            top={{ xs: 0, lg: 0 }}
            left={{ xs: -20, lg: -55 }}
          >
            <img
              height="auto"
              width="auto"
              src={image1.url}
              alt={image1.altText}
            />
          </Box>
          <Box
            position="absolute"
            right={{ xs: "unset", lg: -25 }}
            left={{ xs: 30, lg: "unset" }}
            top={{ xs: 40, lg: 135 }}
          >
            <img
              height="auto"
              width="auto"
              src={image2.url}
              alt={image2.altText}
            />
          </Box>
          <Box
            position="absolute"
            top={{ xs: 140, lg: 265 }}
            left={{ xs: -20, lg: -60 }}
          >
            <img
              height="auto"
              width="auto"
              src={image3.url}
              alt={image3.altText}
            />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default function Index() {
  const copy = useParentSidebarCopy();
  const images = useParentImageCopy();
  const location = useLocation();

  const authImages = useMemo(() => {
    return images?.imageURLs.filter(
      (img) => !img.hidden && img.location === "auth"
    );
  }, [images]);

  const onboardingImages = useMemo(() => {
    return images?.imageURLs
      .filter((img) => !img.hidden && img.location === "onboarding")
      ?.sort(
        ({ name: prevName }, { name: nextName }) =>
          parseInt(prevName) - parseInt(nextName)
      );
  }, [images]);

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

        {/* TODO: Implement images in CMS 
          https://usa-vbt.atlassian.net/browse/BA-166?atlOrigin=eyJpIjoiZTRkMTY5MzY1ODFkNGQ2ZmFiOTY2NDA5MjgzZDBmNjciLCJwIjoiaiJ9
          */}
        {location.pathname.includes("onboarding") ? (
          onboardingImages?.length ? (
            <ImageSpreadDisplay images={onboardingImages} />
          ) : null
        ) : (
          <Stack
            position="relative"
            padding={{ xs: "3rem", lg: "3rem 3rem 3rem 6rem" }}
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Stack alignItems="center" width="320">
              <Carousel images={authImages} />
              <Box paddingTop={4}>
                <PortableText value={copy?.content} />
              </Box>
            </Stack>
          </Stack>
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
