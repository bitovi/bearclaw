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
import { Button } from "~/components/button";
import Stack from "@mui/material/Stack";
import { TextInput } from "~/components/input";
import type { TextFieldProps } from "@mui/material/TextField";
import { useRef } from "react";
import React from "react";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import { getUser } from "~/session.server";
import { retrieveVerificationToken } from "~/models/verificationToken.server";
import { Loading } from "~/components/loading/Loading";

interface CodeInputBoxProps extends Omit<Partial<TextFieldProps>, "onKeyDown"> {
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}
const CodeInputBox = React.forwardRef<HTMLInputElement, CodeInputBoxProps>(
  (props, ref) => {
    const { onKeyDown, ...textInputProps } = props;
    return (
      <TextInput
        inputRef={ref}
        variant="standard"
        autoComplete="off"
        inputProps={{
          placeholder: "-",
          onKeyDown,
          required: true,
          sx: {
            textAlign: "center",
            "&[type=number]": {
              MozAppearance: "textfield",
            },
            "&::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "&::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          },
          type: "number",
        }}
        InputProps={{
          disableUnderline: true,
          sx: {
            color: "#FFF",
          },
        }}
        sx={{
          width: "56px",
          height: "56px",
          display: "flex",
          flexDirection: "row",
          borderRadius: "8px",
          border: "1px solid #FFF",
          color: "#FFF",
        }}
        {...textInputProps}
      />
    );
  }
);

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
  const user = await getUser(request);

  if (!user) {
    return json({
      error: "User not found",
    });
  }

  const formData = await request.formData();
  const redirectTo = formData.get("redirectTo");
  const digit1 = formData.get("digit1");
  const digit2 = formData.get("digit2");
  const digit3 = formData.get("digit3");
  const digit4 = formData.get("digit4");
  const digit5 = formData.get("digit5");
  const digit6 = formData.get("digit6");

  if (digit1 && digit2 && digit3 && digit4 && digit5 && digit6) {
    const num = parseInt(
      `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`
    );
    const verificationToken = await retrieveVerificationToken(user.id, num);
    if (verificationToken.token) {
      const validate = await validateUser(user.id);
      if (!validate.error) {
        return redirectTo
          ? redirect(redirectTo.toString())
          : redirect("/dashboard");
      } else {
        return json({
          error: validate.error,
        });
      }
    } else {
      return json({
        error: verificationToken.error,
      });
    }
  }

  return json({
    error: "Invalid code entry",
  });
}

const onInputChange = ({
  e,
  previousRef,
  nextRef,
}: {
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  previousRef?: React.RefObject<HTMLInputElement>;
  nextRef?: React.RefObject<HTMLInputElement>;
}) => {
  if (e.target.value.length) {
    nextRef?.current?.focus();
  }
  if (e.target.value.length === 0) {
    previousRef?.current?.focus();
  }
};

const onInputKeydown = ({
  e,
  previousRef,
  nextRef,
}: {
  e: React.KeyboardEvent<HTMLInputElement>;
  previousRef?: React.RefObject<HTMLInputElement>;
  nextRef?: React.RefObject<HTMLInputElement>;
}) => {
  if (!e.currentTarget.value && e.code === "Backspace") {
    previousRef?.current?.focus();
  }
  if (e.currentTarget.value && e.code !== "Backspace") {
    e.preventDefault();
    nextRef?.current?.focus();
  }
};

export default function Route() {
  const { redirectTo, email } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const digit1Ref = useRef<HTMLInputElement>(null);
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);
  const digit4Ref = useRef<HTMLInputElement>(null);
  const digit5Ref = useRef<HTMLInputElement>(null);
  const digit6Ref = useRef<HTMLInputElement>(null);

  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
    >
      <Typography variant="h5">Please check your email!</Typography>
      <Typography variant="body2">
        We've emailed a 6-digit confirmation code to{" "}
        {email || "your provided email"}, please enter the code below to verify
        your account.
      </Typography>
      {actionData?.error && (
        <Typography paddingTop={2} color="error" variant="body1">
          {actionData.error}
        </Typography>
      )}
      <Form method="POST" action="/verifyEmail">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Stack
          paddingY={4}
          direction="row"
          width="100%"
          gap={2}
          justifyContent={"center"}
          alignItems="center"
          alignSelf="stretch"
        >
          <CodeInputBox
            ref={digit1Ref}
            onChange={(e) => onInputChange({ e, nextRef: digit2Ref })}
            onKeyDown={(e) => onInputKeydown({ e, nextRef: digit2Ref })}
            name={"digit1"}
            autoFocus
          />
          <CodeInputBox
            ref={digit2Ref}
            onChange={(e) =>
              onInputChange({ e, nextRef: digit3Ref, previousRef: digit1Ref })
            }
            onKeyDown={(e) =>
              onInputKeydown({ e, previousRef: digit1Ref, nextRef: digit3Ref })
            }
            name={"digit2"}
          />
          <CodeInputBox
            ref={digit3Ref}
            onChange={(e) =>
              onInputChange({ e, nextRef: digit4Ref, previousRef: digit2Ref })
            }
            onKeyDown={(e) =>
              onInputKeydown({ e, previousRef: digit2Ref, nextRef: digit4Ref })
            }
            name={"digit3"}
          />
          <CodeInputBox
            ref={digit4Ref}
            onChange={(e) =>
              onInputChange({ e, nextRef: digit5Ref, previousRef: digit3Ref })
            }
            onKeyDown={(e) =>
              onInputKeydown({ e, previousRef: digit3Ref, nextRef: digit5Ref })
            }
            name={"digit4"}
          />
          <CodeInputBox
            ref={digit5Ref}
            onChange={(e) =>
              onInputChange({ e, nextRef: digit6Ref, previousRef: digit4Ref })
            }
            onKeyDown={(e) =>
              onInputKeydown({ e, previousRef: digit4Ref, nextRef: digit6Ref })
            }
            name={"digit5"}
          />
          <CodeInputBox
            ref={digit6Ref}
            onChange={(e) => onInputChange({ e, previousRef: digit5Ref })}
            onKeyDown={(e) => onInputKeydown({ e, previousRef: digit5Ref })}
            name={"digit6"}
          />
        </Stack>
        <Button
          type="submit"
          variant="buttonLarge"
          color="primary"
          disabled={
            navigation.state === "submitting" || navigation.state === "loading"
          }
        >
          {navigation.state === "submitting" ||
          navigation.state === "loading" ? (
            <Loading />
          ) : (
            "VERIFY"
          )}
        </Button>
      </Form>
      <Box>
        <Typography component="span" variant="body2">
          Don't have a code?{" "}
        </Typography>
        <Typography
          component={Link}
          to="/verificationEmailResend"
          color="secondary.main"
          variant="body2"
        >
          Resend code
        </Typography>
      </Box>
      <ButtonLink
        variant="buttonMedium"
        to="/login"
        sx={{
          "&:hover": { backgroundColor: "#FFF" },
          color: "primary.main",
        }}
      >
        <KeyboardArrowLeftIcon />
        Return to Sign In
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
  );
}
