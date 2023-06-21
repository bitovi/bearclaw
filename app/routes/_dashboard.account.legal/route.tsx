import { Box, Stack, Typography } from "@mui/material";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import { usePageCopy } from "../_dashboard/copy";
import { RichTextField } from "~/components/richTextField/RichTextField";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  const pageType = url.searchParams.get("pageType");
  return json({ pageType: pageType === "terms" ? "terms" : "privacy" });
}

export default function Route() {
  const { pageType } = useLoaderData<typeof loader>();
  const copy = usePageCopy("account");

  return (
    <Box paddingLeft={2}>
      <Stack direction="row" paddingBottom={3}>
        <Box
          sx={
            pageType === "privacy" ? { borderBottom: "2px solid #485AFF" } : {}
          }
        >
          <ButtonLink
            name="privacyPolicy"
            to={`./?pageType=privacy`}
            variant="buttonMedium"
            title="See privacy policy"
            sx={{ position: "relative" }}
            aria-label={
              pageType === "privacy"
                ? `privacy-button-selected`
                : "privacy-button-unselected"
            }
          >
            <Typography
              color={pageType === "privacy" ? "primary.main" : "text.secondary"}
            >
              {copy?.content?.find((c) => c.key === "privacyTab")?.value}
            </Typography>
          </ButtonLink>
        </Box>
        <Box
          sx={pageType === "terms" ? { borderBottom: "2px solid #485AFF" } : {}}
        >
          <ButtonLink
            name="termsAndConditions"
            to={"./?pageType=terms"}
            title="See terms & conditions"
            variant="buttonMedium"
            sx={{ position: "relative" }}
            aria-label={
              pageType === "terms"
                ? `terms-button-selected`
                : "terms-button-unselected"
            }
          >
            <Typography
              color={pageType === "terms" ? "primary.main" : "text.secondary"}
            >
              {copy?.content?.find((c) => c.key === "termsTab")?.value}
            </Typography>
          </ButtonLink>
        </Box>
      </Stack>
      <Box>
        <RichTextField
          contentKey={pageType === "terms" ? "terms" : "privacy"}
          richContent={copy?.richContent}
        />
      </Box>
    </Box>
  );
}