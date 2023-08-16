import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Form, useActionData } from "@remix-run/react";
import { Dropdown, TextInput } from "~/components/input";
import Button from "@mui/material/Button";
import { sendMail } from "~/services/mail/sendMail.server";

import { useAuthPageCopy } from "../_auth/copy";
import Skeleton from "@mui/material/Skeleton";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const subject = formData.get("selectCategory");
  const details = formData.get("additionalDetails");
  const email = formData.get("email");

  if (
    !subject ||
    typeof subject !== "string" ||
    !details ||
    typeof details !== "string" ||
    !email ||
    typeof email !== "string"
  ) {
    return json({
      success: false,
      error:
        "Please ensure both the subject and details fields have content and resubmit",
    });
  }

  try {
    await sendMail({
      to: process.env.EMAIL_SUPPORT || "host",
      from: process.env.EMAIL_FROM,
      replyTo: email,
      subject,
      html: `
    <p>User support request: </p>
    <p>${details}</p>
    `,
    });
    return json({ success: true, error: "" });
  } catch (e) {
    console.error((e as Error).message);
    return json({ success: false, error: (e as Error).message });
  }
}

const SuccessView = () => {
  const copy = useAuthPageCopy("help");

  return (
    <Form method="get">
      <Stack alignItems="center" gap={4}>
        <Skeleton
          animation={false}
          variant="rectangular"
          width="128px"
          height="128px"
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
        <Box textAlign={"center"}>
          <Typography variant="h4" paddingBottom={1}>
            {copy?.content?.successHeading || "Thank you"}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {copy?.content?.successMessage ||
              "You will be hearing back from us soon!"}
          </Typography>
        </Box>

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
          {copy?.content?.successNewFormButton || "Submit another form"}
        </Button>
        <Box sx={{ alignSelf: "center" }}>
          <ButtonLink to="/login">Return to sign in</ButtonLink>
        </Box>
      </Stack>
    </Form>
  );
};

export default function Route() {
  const copy = useAuthPageCopy("help");
  const actionData = useActionData<typeof action>();

  return actionData?.success ? (
    <SuccessView />
  ) : (
    <Box>
      <Box paddingBottom={1}>
        <Typography variant="h5" color="text.primary" paddingBottom={1}>
          {copy?.title || "Help"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {copy?.headline ||
            "Need help? We are here to answer your questions and help solve any issues you're experiencing."}
        </Typography>
      </Box>
      <Stack paddingTop={2} alignItems="center">
        <Box method="post" component={Form} width={{ xs: "auto", sm: "552px" }}>
          <Stack gap={2}>
            {copy?.inputs?.selectCategory?.questionType === "select" && (
              <Dropdown
                fullWidth
                name={copy?.inputs?.selectCategory?.name || "selectCategory"}
                label={copy?.inputs?.selectCategory?.label || "Select Category"}
                required={true}
                options={copy?.inputs?.selectCategory.optionList || []}
                disabled={copy?.inputs?.selectCategory?.disabled}
                defaultValue={
                  copy?.inputs?.selectCategory?.optionList?.[0].value
                }
              />
            )}
            <TextInput
              name={copy?.inputs?.email.name || "email"}
              placeholder={
                copy?.inputs?.email.placeholder || "YourEmail@email.com"
              }
              label={copy?.inputs?.email.label || "Your email"}
              required={true}
              InputLabelProps={{ required: true }}
            />
            <TextInput
              name={
                copy?.inputs?.additionalDetails?.name || "additionalDetails"
              }
              placeholder={
                copy?.inputs?.additionalDetails?.placeholder ||
                "How can we help?"
              }
              label={
                copy?.inputs?.additionalDetails?.label || "Additional Details"
              }
              required={true}
              fullWidth
              InputLabelProps={{ required: true }}
              minRows={4}
              multiline={
                copy?.inputs?.additionalDetails?.questionType === "textarea"
              }
            />
            <Box alignSelf={"flex-end"}>
              <Button variant="buttonMedium" name="submit" type="submit">
                {copy?.content?.submitButton || "Submit"}
              </Button>
            </Box>
            <Box sx={{ alignSelf: "center" }}>
              <ButtonLink to="/login">Return to sign in</ButtonLink>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
