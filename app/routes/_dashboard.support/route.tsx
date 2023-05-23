import {
  Box,
  Stack,
  Typography,
  Container,
  Button,
  Skeleton,
} from "@mui/material";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Banner } from "~/components/banner";
import { TextInput } from "~/components/input";
import { sendMail } from "~/services/mail/sendMail";
import { getUser } from "~/session.server";

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

        <Typography variant="h4">Thank you</Typography>
        <Typography variant="body1" color="text.primary">
          You will be hearing from us soon!
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
          Submit another form
        </Button>
      </Stack>
    </Form>
  );
};

export default function Route() {
  const actionData = useActionData<typeof action>();

  return (
    <Container>
      {actionData?.success ? (
        <SuccessView />
      ) : (
        <>
          <Box>
            <Typography variant="h5" color="text.primary">
              How can we help?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill out the form and our team will get back to you within 24
              hours.
            </Typography>
          </Box>
          <Stack paddingTop={2}>
            <Form method="post">
              <Stack gap={2}>
                <TextInput
                  name="subject"
                  label="Subject"
                  required
                  autoFocus={true}
                  fullWidth
                  InputLabelProps={{ required: true }}
                  placeholder="Please select a subject related to your inquiry."
                />
                <TextInput
                  name="Additional details"
                  label="Additional details"
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
                  Submit
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
