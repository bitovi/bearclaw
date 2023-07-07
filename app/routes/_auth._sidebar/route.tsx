import { Outlet } from "@remix-run/react";
import Box from "@mui/material/Box";
import { PortableText } from "@portabletext/react";
import { useParentSidebarCopy } from "../_auth/copy";
import { json } from "@remix-run/server-runtime";

export async function loader() {
  return json({});
}

export default function Index() {
  const copy = useParentSidebarCopy();

  return (
    <Box
      component="main"
      display="flex"
      flexDirection={{ xs: "column-reverse", md: "row" }}
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
        maxWidth={{ xs: "unset", md: "480px" }}
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
        <Box
          position="relative"
          margin={{ xs: "3rem", md: "3rem 3rem 3rem 6rem" }}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <PortableText value={copy?.content} />
        </Box>
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
        <Box maxWidth="700px" padding={{ xs: "5rem 1rem", md: "unset" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
