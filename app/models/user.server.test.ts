import { getUserPasswordError } from "./user.server";

describe("getUserPasswordError", () => {
  it("should return an error message when given an empty password", () => {
    const error = getUserPasswordError("");
    expect(error).toBe("Password is required");
  });

  it("should return an error message when given a password that is too short", () => {
    const error = getUserPasswordError("short");
    expect(error).toBe("Password is too short");
  });

  it("should return an error message when given a password without an uppercase letter", () => {
    const error = getUserPasswordError("password12345");
    expect(error).toBe("Password must contain at least one uppercase letter");
  });

  it("should return an error message when given a password without a lowercase letter", () => {
    const error = getUserPasswordError("PASSWORD12345");
    expect(error).toBe("Password must contain at least one lowercase letter");
  });

  it("should return an error message when given a password without a number or symbol", () => {
    const error = getUserPasswordError("PasswordPassword");
    expect(error).toBe("Password must contain at least one number or symbol");
  });

  it("should return null when given a valid password", () => {
    const error = getUserPasswordError("Password12345!");
    expect(error).toBeNull();
  });
});
