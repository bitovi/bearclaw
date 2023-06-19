import { Box, Stack, Typography } from "@mui/material";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  const pageType = url.searchParams.get("pageType");
  return json({ pageType: pageType === "terms" ? "terms" : "privacy" });
}

export default function Route() {
  const { pageType } = useLoaderData<typeof loader>();

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
              Privacy & Policy
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
              Terms & Conditions
            </Typography>
          </ButtonLink>
        </Box>
      </Stack>
      <Typography variant="h6" color="text.primary">
        {pageType === "privacy"
          ? "This is privacy copy"
          : "This is terms and conditions copy"}
      </Typography>
      Security Secondary Privacy & Policy Terms & Conditions Subscription
      Secondary Ut vestibulum amet odio tempus phasellus. Sed quis auctor
      aliquet tristique. Auctor. Payment Secondary Settings Tincidunt et orci
      neque velit mi. Imperdiet diam in elementum rutrum tortor semper donec. Ac
      suscipit eu etiam placerat facilisi risus fames id aliquet. Orci in
      scelerisque morbi velit in. Auctor vitae ornare convallis id. Massa
      pretium aliquam senectus ultrices tincidunt vulputate eget quis. Quis
      posuere consectetur non ac molestie eros amet aliquet. Dictum lorem
      convallis quis volutpat semper augue nunc. Arcu nunc purus aliquam
      vulputate eget et in volutpat nibh. Volutpat aliquam bibendum tristique
      sed. Morbi at aliquam velit malesuada. Quam urna sem bibendum ipsum
      sollicitudin. Duis urna libero ornare duis. Lectus purus felis ut amet
      massa. Tincidunt et orci neque velit mi. Imperdiet diam in elementum
      rutrum tortor semper donec. Ac suscipit eu etiam placerat facilisi risus
      fames id aliquet. Orci in scelerisque morbi velit in. Auctor vitae ornare
      convallis id. Massa pretium aliquam senectus ultrices tincidunt vulputate
      eget quis. Quis posuere consectetur non ac molestie eros amet aliquet.
      Dictum lorem convallis quis volutpat semper augue nunc. Arcu nunc purus
      aliquam vulputate eget et in volutpat nibh. Volutpat aliquam bibendum
      tristique sed. Morbi at aliquam velit malesuada. Quam urna sem bibendum
      ipsum sollicitudin. Duis urna libero ornare duis. Lectus purus felis ut
      amet massa. Tincidunt et orci neque velit mi. Imperdiet diam in elementum
      rutrum tortor semper donec. Ac suscipit eu etiam placerat facilisi risus
      fames id aliquet. Orci in scelerisque morbi velit in. Auctor vitae ornare
      convallis id. Massa pretium aliquam senectus ultrices tincidunt vulputate
      eget quis. Quis posuere consectetur non ac molestie eros amet aliquet.
      Dictum lorem convallis quis volutpat semper augue nunc. Arcu nunc purus
      aliquam vulputate eget et in volutpat nibh. Volutpat aliquam bibendum
      tristique sed. Morbi at aliquam velit malesuada. Quam urna sem bibendum
      ipsum sollicitudin. Duis urna libero ornare duis. Lectus purus felis ut
      amet massa. Secondary Support Secondary Legal Secondary At ac lorem
      quisque at nisl arcu nunc venenatis. Diam nec nisl eu velit nunc eget.
      Tincidunt et orci neque velit mi. Imperdiet diam in elementum rutrum
      tortor semper donec. Ac suscipit eu etiam placerat facilisi risus fames id
      aliquet. Orci in scelerisque morbi velit in. Auctor vitae ornare convallis
      id. Massa pretium aliquam senectus ultrices tincidunt vulputate eget quis.
      Quis posuere consectetur non ac molestie eros amet aliquet. Dictum lorem
      convallis quis volutpat semper augue nunc. Arcu nunc purus aliquam
      vulputate eget et in volutpat nibh. Volutpat aliquam bibendum tristique
      sed. Morbi at aliquam velit malesuada. Quam urna sem bibendum ipsum
      sollicitudin. Duis urna libero ornare duis. Lectus purus felis ut amet
      massa.
    </Box>
  );
}
