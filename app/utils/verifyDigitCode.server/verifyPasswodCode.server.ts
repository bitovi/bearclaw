import { isResetPasswordTokenValid } from "~/models/user.server";
import type { User } from "@prisma/client";

/**
 *
 * Validates a provided 6-digit code against a PasswordResetToken
 */
export const verifyPasswordCode = async (user: User, formData: FormData) => {
  const tokenCode = formData.get("tokenCode")?.toString();

  if (tokenCode) {
    const isValid = await isResetPasswordTokenValid(user, tokenCode);
    return {
      isValid,
      error: isValid ? "" : "Invalid code",
      code: tokenCode,
    };
  }
  return {
    isValid: false,
    error: "Please enter a full 6-digit number",
    code: null,
  };
};
