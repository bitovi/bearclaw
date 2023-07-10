import Box from "@mui/material/Box";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Typography from "@mui/material/Typography";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "~/components/link";
import { validateUser } from "~/models/user.server";
import { safeRedirect } from "~/utils";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import { getUser, getUserId } from "~/session.server";
import { useParentFormCopy } from "../_auth/copy";
import { CodeValidationInput } from "~/components/codeValidationInput";
import { verifyValidationCode } from "~/utils/verifyDigitCode.server";
import { ButtonLoader } from "~/components/buttonLoader";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const user = await getUser(request);
  const redirectTo = safeRedirect(url.searchParams.get("redirectTo"));
  return json({
    redirectTo,
    email: user?.email,
  });
}
export async function action({ request }: ActionArgs) {
  const userId = await getUserId(request);
  const formData = await request.formData();

  if (!userId) {
    return json({
      error: "User not found",
    });
  }

  const redirectTo = formData.get("redirectTo")?.toString();

  const { status, error } = await verifyValidationCode({
    userId,
    formData,
  });

  if (status) {
    const validate = await validateUser(userId);
    if (!validate.error) {
      return redirectTo
        ? redirect(
            `/onboarding${redirectTo ? `?redirectTo=${redirectTo}` : ""}`
          )
        : redirect("/onboarding");
    } else {
      return json({
        error: validate.error,
      });
    }
  }

  return json({
    error,
  });
}

export default function Route() {
  const { redirectTo, email } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const formCopy = useParentFormCopy();
  const navigation = useNavigation();

  return (
    <Form method="POST" action="/verifyEmail">
      <Box
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <Typography variant="h5">
          {formCopy?.checkYourEmail || "Please check your email!"}
        </Typography>
        <Typography variant="body2">
          {formCopy?.verifyEmailInstructionPart1 ||
            "We've emailed a 6-digit confirmation code to"}{" "}
          {email || "your provided email"},{" "}
          {formCopy?.verifyEmailInstructionPart2 ||
            "please enter the code below to verify your account."}
        </Typography>
        {actionData?.error && (
          <Typography paddingTop={2} color="error" variant="body1">
            {actionData.error}
          </Typography>
        )}
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <CodeValidationInput
          autoFocus
          containerProps={{ marginLeft: { xs: "3rem", lg: "unset" } }}
        />
        <ButtonLoader
          loading={
            navigation.state === "submitting" || navigation.state === "loading"
          }
          type="submit"
          variant="buttonLarge"
          color="primary"
        >
          {formCopy?.verifyEmailButton || "VERIFY"}
        </ButtonLoader>
        <Box>
          <Typography component="span" variant="body2">
            {formCopy?.dontHaveCode || "Don't have a code?"}{" "}
          </Typography>
          <Typography
            component={Link}
            to="/verificationEmailResend"
            color="secondary.main"
            variant="body2"
          >
            {formCopy?.resendCode || "Resend code"}
          </Typography>
        </Box>
        <ButtonLink
          variant="buttonMedium"
          to="/logout"
          sx={{
            "&:hover": { backgroundColor: "#FFF" },
            color: "primary.main",
          }}
        >
          <KeyboardArrowLeftIcon />
          {formCopy?.returnToSignInCTA || "Return to Sign In"}
        </ButtonLink>
        <br />
        <br />
        <br />
        <Typography>
          TESTING: Email messaging is not connected yet.{" "}
          <Typography component={Link} to="/fakeMail" color="secondary.main">
            View verification emails here
          </Typography>
        </Typography>
      </Box>
    </Form>
  );
}
