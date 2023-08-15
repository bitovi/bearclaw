import { Outlet, useLocation } from "@remix-run/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PortableText } from "@portabletext/react";
import { useParentImageCopy, useParentSidebarCopy } from "../_auth/copy";
import { useMemo } from "react";
import { Logo } from "~/components/logo/Logo";
import { ColorModeToggle } from "~/styles/ColorModeToggle";

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
          background: "linear-gradient(180deg, #000 0%, #00057A 100%)",
        }}
      >
        <Box
          position="absolute"
          component="img"
          src="/images/cornerEdge.png"
          top="-4rem"
          height="calc(50% + 15rem)"
          left="0"
          sx={{
            transform: "rotate(180deg)",
          }}
        />
        <Box
          position="absolute"
          component="img"
          src="/images/cornerEdge.png"
          bottom="-2rem"
          height="calc(50% + 9rem)"
          left="0"
          sx={{
            transform: "scaleX(-1)",
          }}
        />
        {location.pathname.includes("onboarding") ? (
          onboardingImages?.length ? (
            <Stack
              position="relative"
              height="100%"
              width="100%"
              alignItems="center"
              justifyItems="center"
              justifyContent="center"
              paddingX={{ sm: 0, lg: 7 }}
            >
              <Box paddingBottom={4} marginTop={{ xs: 4, lg: 0 }}>
                <Logo
                  variant="imageOnly"
                  width="9.75rem"
                  imageColor="#ffffff"
                />
              </Box>
              <Box maxWidth="480px">
                <img
                  height="auto"
                  width="100%"
                  src={onboardingImages[0].url}
                  alt={onboardingImages[0].altText}
                />
              </Box>
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
              <Box maxWidth="480px">
                <img
                  height="auto"
                  width="100%"
                  src={authImages?.[0].url}
                  alt={authImages?.[0].altText}
                />
              </Box>
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
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "background.paper",
        }}
      >
        <Box maxWidth="700px" padding={{ xs: "5rem 1rem", lg: "unset" }}>
          <Outlet />
        </Box>
        <ColorModeToggle />
      </Box>
    </Box>
  );
}
