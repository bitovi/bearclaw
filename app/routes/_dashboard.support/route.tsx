import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Banner } from "~/components/banner";
import { TextInput } from "~/components/input";
import { sendMail } from "~/services/mail/sendMail";
import { getUser } from "~/session.server";
import { usePageCopy } from "../_dashboard/copy";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const user = await getUser(request);

  if (!user) {
    return json({
      success: false,
      error:
        "Something went wrong, please try signing back in and resubmitting",
    });
  }

  const subject = formData.get("subject");
  const details = formData.get("Additional details");
  if (
    !subject ||
    typeof subject !== "string" ||
    !details ||
    typeof details !== "string"
  ) {
    return json({
      success: false,
      error:
        "Please ensure both the subject and details fields have content and resubmit",
    });
  }

  try {
    await sendMail(
      {
        to: "host",
        from: `${user.email}`,
        subject,
        html: `
    <p>User support request: </p>
    <p>${details}</p>
    `,
      },
      true
    );
    return json({ success: true, error: "" });
  } catch (e) {
    console.error((e as Error).message);
    return json({ success: false, error: (e as Error).message });
  }
}

const SuccessView = () => {
  const copy = usePageCopy("support");

  return (
    <Form method="get">
      <Stack alignItems="center" gap={2}>
        <Skeleton
          animation={false}
          variant="rectangular"
          width="100px"
          height="100px"
          sx={{ display: "flex" }}
          component={Box}
          justifyContent={"center"}
          alignItems="center"
          borderRadius="32px"
        >
          <Typography component="span" visibility={"visible"}>
            Graphic
          </Typography>
        </Skeleton>

        <Typography variant="h4">{copy?.content?.successHeading}</Typography>
        <Typography variant="body1" color="text.primary">
          {copy?.content?.successMessage}
        </Typography>

        <Button
          variant="buttonLarge"
          type="submit"
          name="submit"
          sx={{
            color: "primary.contrast",
            width: "100%",
            maxWidth: "660px",
          }}
        >
          {copy?.content?.successNewFormButton}
        </Button>
      </Stack>
    </Form>
  );
};

export default function Route() {
  const actionData = useActionData<typeof action>();
  const copy = usePageCopy("support");

  return (
    <Container>
      {actionData?.success ? (
        <SuccessView />
      ) : (
        <>
          <Box>
            <Typography variant="h5" color="text.primary">
              {copy?.headline}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {copy?.content?.subHeading}
            </Typography>
          </Box>
          <Stack paddingTop={2}>
            <Form method="post">
              <Stack gap={2}>
                <TextInput
                  name="subject"
                  label={copy?.content?.subjectLabel}
                  required
                  autoFocus={true}
                  fullWidth
                  InputLabelProps={{ required: true }}
                  placeholder={copy?.content?.subjectPlaceholderText}
                />
                <TextInput
                  name="Additional details"
                  label={copy?.content?.detailsLabel}
                  required
                  fullWidth
                  InputLabelProps={{ required: true }}
                  minRows={4}
                  multiline
                />
                <Button
                  variant="buttonMedium"
                  name="submit"
                  type="submit"
                  sx={{
                    alignSelf: "flex-end",
                  }}
                >
                  {copy?.content?.submitButton}
                </Button>
              </Stack>
            </Form>
          </Stack>
        </>
      )}

      {actionData?.error && (
        <Banner
          container={{
            open: !!actionData.error,
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
          }}
          alert={{
            sx: { minWidth: "240px" },
          }}
          title="Error"
          content={actionData.error}
        />
      )}
    </Container>
  );
}
