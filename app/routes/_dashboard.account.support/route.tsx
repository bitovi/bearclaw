import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Banner } from "~/components/banner";
import { Dropdown, TextInput } from "~/components/input";
import { sendMail } from "~/services/mail/sendMail.server";
import { getUser } from "~/session.server";
import { usePageCopy } from "../_dashboard/copy";
import { Page } from "../_dashboard/components/page";

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

  const subject = formData.get("selectCategory");
  const details = formData.get("additionalDetails");

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
    await sendMail({
      to: process.env.EMAIL_SUPPORT || "host",
      from: process.env.EMAIL_FROM,
      replyTo: user.email,
      subject,
      html: `
    <p>User support request: </p>
    <p>${details}</p>
    <p>User email: ${user.email}</p>
    `,
    });
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
      </Stack>
    </Form>
  );
};

export default function Route() {
  const actionData = useActionData<typeof action>();
  const copy = usePageCopy("support");

  return (
    <Page>
      {actionData?.success ? (
        <SuccessView />
      ) : (
        <>
          <Box>
            <Typography variant="h5" color="text.primary" paddingBottom={1}>
              {copy?.headline}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {copy?.content?.subHeading}
            </Typography>
          </Box>
          <Stack paddingTop={2} width={{ xs: "auto", lg: "552px" }}>
            <Form method="post">
              <Stack gap={2}>
                {copy?.inputs?.selectCategory?.questionType === "select" && (
                  <Dropdown
                    fullWidth
                    name={
                      copy?.inputs?.selectCategory?.name || "selectCategory"
                    }
                    label={
                      copy?.inputs?.selectCategory?.label || "Select Category"
                    }
                    required={copy?.inputs?.selectCategory?.required}
                    options={copy?.inputs?.selectCategory.optionList || []}
                    disabled={copy?.inputs?.selectCategory?.disabled}
                    defaultValue={
                      copy?.inputs?.selectCategory?.optionList?.[0].value
                    }
                  />
                )}

                <TextInput
                  name={
                    copy?.inputs?.additionalDetails?.name || "additionalDetails"
                  }
                  placeholder={
                    copy?.inputs?.additionalDetails?.placeholder ||
                    "How can we help?"
                  }
                  label={
                    copy?.inputs?.additionalDetails?.label ||
                    "Additional Details"
                  }
                  required={copy?.inputs?.additionalDetails?.required}
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
    </Page>
  );
}
