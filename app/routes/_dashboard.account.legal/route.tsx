import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "@remix-run/react";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import { usePageCopy } from "../_dashboard/copy";
import { PortableText } from "@portabletext/react";

export default function Route() {
  const [searchParams] = useSearchParams();
  const pageType =
    searchParams.get("pageType") === "terms" ? "terms" : "privacy";
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
              {copy?.content?.privacyTab}
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
                ? "terms-button-selected"
                : "terms-button-unselected"
            }
          >
            <Typography
              color={pageType === "terms" ? "primary.main" : "text.secondary"}
            >
              {copy?.content?.termsTab}
            </Typography>
          </ButtonLink>
        </Box>
      </Stack>
      <Box>
        <PortableText
          value={
            copy?.richContent?.[pageType === "terms" ? "terms" : "privacy"] ||
            []
          }
        />
      </Box>
    </Box>
  );
}
