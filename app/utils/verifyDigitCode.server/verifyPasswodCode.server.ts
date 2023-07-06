import { isResetPasswordTokenValid } from "~/models/user.server";

/**
 *
 * Validates a provided 6-digit code against a PasswordResetToken
 */
export const verifyPasswordCode = async (formData: FormData) => {
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
    const isValid = await isResetPasswordTokenValid(num);
    return {
      isValid,
      error: isValid ? "" : "Invalid code",
      code: num,
    };
  }
  return {
    isValid: false,
    error: "Please enter a full 6-digit number",
    code: null,
  };
};
