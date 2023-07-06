import { retrieveVerificationToken } from "~/models/verificationToken.server";

/**
 *
 * Validates a provided 6-digit code input by either a provided userId or email against a VerificationToken
 */
export const verifyValidationCode = async ({
  userId,
  formData,
}: {
  userId: string;
  formData: FormData;
}) => {
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

    const verificationToken = await retrieveVerificationToken(userId, num);
    if (verificationToken.token) {
      return {
        status: true,
        error: "",
      };
    } else {
      return {
        status: false,
        error: verificationToken.error,
      };
    }
  } else {
    return {
      status: false,
      error: "Please provide a 6 digit code",
    };
  }
};
