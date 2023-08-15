import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createResetPasswordToken } from "~/models/user.server";
import { validateVerificationToken } from "~/models/verificationToken.server";
import { requireUser } from "~/session.server";
import { FORM } from "../route";

export async function validateTokenAction(request: ActionArgs["request"]) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const form = formData.get("form");
  const token = formData.get("token");
  invariant(form === FORM.VALIDATE_RESET_TOKEN, "Invalid form");
  invariant(token && typeof token === "string", "Token is required");
  const validatedToken = await validateVerificationToken(user.id, token);
  if (!validatedToken) {
    return json({ form, token: null, success: false });
  }
  const { token: newToken } = await createResetPasswordToken(user);

  return json({ form, token: newToken, success: true });
}