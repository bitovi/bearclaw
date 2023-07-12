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
  const tokenCode = formData.get("tokenCode")?.toString();

  if (tokenCode) {
    const verificationToken = await retrieveVerificationToken(
      userId,
      tokenCode
    );
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
