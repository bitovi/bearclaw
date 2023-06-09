export const MFA_TYPE = {
  EMAIL: "email",
  SMS: "sms",
} as const;

export type MfaType = (typeof MFA_TYPE)[keyof typeof MFA_TYPE];

export function isMfaType(value: string): value is MfaType {
  return Object.values(MFA_TYPE).includes(value as MfaType);
}
