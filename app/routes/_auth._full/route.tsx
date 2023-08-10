import { Outlet } from "@remix-run/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Logo } from "~/components/logo/Logo";
import { Link } from "~/components/link";
import { useParentFormCopy } from "../_auth/copy";
import { PortableText } from "@portabletext/react";

export default function Index() {
  const formCopy = useParentFormCopy();

  return (
    <Box
      component="main"
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      height={{ xs: "auto", md: "100%" }}
      minHeight="100%"
      width="100%"
    >
      <Box
        position="relative"
        flex="1"
        width="100%"
        display="flex"
        flexDirection="column"
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
          bottom="0"
          left="0"
          height="100%"
          sx={{
            transform: "scaleX(-1)",
          }}
        />
        <Box
          position="absolute"
          component="img"
          src="/images/cornerEdge.png"
          bottom="0"
          right="0"
          height="100%"
        />
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="2rem 3rem"
        >
          <Logo imageColor="white" textColor="white" />
          {formCopy?.needHelp ? (
            <Typography
              variant="body2"
              component={"div"}
              zIndex={1}
              color="white"
              sx={{
                textDecoration: "none",
                color: "white",
                "& a": {
                  color: "white",
                  textDecoration: "none",
                },
              }}
            >
              <PortableText value={formCopy.needHelp} />
            </Typography>
          ) : (
            <Typography
              variant="body2"
              component={Link}
              zIndex={1}
              to="/help"
              color="white"
              sx={{ textDecoration: "none" }}
            >
              Need Help?
            </Typography>
          )}
        </Box>
        <Box flex="1" position="relative" margin="3rem">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
