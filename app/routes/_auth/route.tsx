import type { V2_MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useMatches } from "@remix-run/react";
import { Box, Typography } from "@mui/material";
import { getClient } from "~/lib/sanity/getClient.server";
import { PortableText } from '@portabletext/react'

export const meta: V2_MetaFunction = () => [
  {
    title: "Authentication",
  },
];

export type AuthSidebarCopy = {
  _type: "content"
  _id: "authSidebar"
  content: any
}

function isAuthSidebarCopy (copy: any): copy is AuthSidebarCopy {
  return copy._id === "authSidebar"
}

export type AuthFormCopy = {
  _id: "authForm"
  email: string,
  password: string
  rememberMe: string
  createAccount: string
  login: string
  noAccountMessage: string
  noAccountLoginLink: string
  existingAccountMessage: string
  existingAccountLoginLink: string
  forgotPasswordLink: string
  alreadyKnowPasswordLink: string
  alreadyKnowPasswordMessage: string
  sendPasswordReset: string
}

export function isAuthFormCopy (copy: any): copy is AuthFormCopy {
  return copy._id === "authForm"
}

export async function loader() {
  const query = `*[_id == "authSidebar" || _id == "authForm"]{...}`;
  const pageCopy = await getClient().fetch<[AuthSidebarCopy | AuthFormCopy]>(query)

  const sidebarCopy = pageCopy.find(isAuthSidebarCopy)
  const formCopy = pageCopy.find(isAuthFormCopy)

  return { sidebarCopy, formCopy }
}

/**
 * Hook to access the form copy from the parent route
 */
export function useParentFormCopy(): AuthFormCopy | null {
  const matches = useMatches();
  const copyMatch = matches.find(match => match.data.formCopy)?.data.formCopy
  return isAuthFormCopy(copyMatch) ? copyMatch : null
}

export default function Index() {
  const { sidebarCopy } = useLoaderData<typeof loader>();

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
          top="-40px"
          sx={{
            background: "#3507EE",
            transform: "rotate(18deg)",
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
            transform: "rotate(-18deg)",
          }}
        />
        <Box
          position="relative"
          margin={{ xs: "3rem", md: "3rem 3rem 3rem 6rem" }}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <PortableText value={sidebarCopy?.content} />
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
          borderBottomLeftRadius: "16px 24px",
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
        <Typography fontWeight={700} fontSize="1.4rem">
          BEARCLAW
        </Typography>
      </Box>
    </Box>
  );
}
