import { Outlet } from "@remix-run/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Logo } from "~/components/logo/Logo";
import { Link } from "~/components/link";
import { useParentFormCopy } from "../_auth/copy";
import { PortableText } from "@portabletext/react";
import { json } from "@remix-run/node";

export async function loader() {
  console.log("LOG LOG LOG LOG ------- _auth._full loader");

  return json({});
}

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
          background:
            "linear-gradient(167.62deg, #192869 19.38%, #0B1433 101.5%)",
        }}
      >
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
              to="/help"
              color="white"
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
