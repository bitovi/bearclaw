import { isResetPasswordTokenValid } from "~/models/user.server";

/**
 *
 * Validates a provided 6-digit code against a PasswordResetToken
 */
export const verifyPasswordCode = async (formData: FormData) => {
  const tokenCode = formData.get("tokenCode")?.toString();

  if (tokenCode) {
    const isValid = await isResetPasswordTokenValid(tokenCode);
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
