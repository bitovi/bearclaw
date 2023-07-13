import { Outlet, useLocation } from "@remix-run/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PortableText } from "@portabletext/react";
import { useParentImageCopy, useParentSidebarCopy } from "../_auth/copy";
import { Carousel } from "~/components/carousel";
import { useMemo } from "react";
import { Logo } from "~/components/logo/Logo";

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
        {location.pathname.includes("onboarding") ? (
          onboardingImages?.length ? (
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
              <img
                height="480"
                width="480"
                src={onboardingImages[0].url}
                alt={onboardingImages[0].altText}
              />
            </Stack>
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
