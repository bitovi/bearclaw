import { getUserFullName } from "./getUserFullName";

describe("getUserFullName", () => {
  it("returns the full name of a user with first and last name", () => {
    const user = { firstName: "John", lastName: "Doe" };
    expect(getUserFullName(user)).toEqual("John Doe");
  });

  it("returns the first name of a user with no last name", () => {
    const user = { firstName: "John", lastName: null };
    expect(getUserFullName(user)).toEqual("John");
  });

  it("returns the last name of a user with no first name", () => {
    const user = { firstName: null, lastName: "Doe" };
    expect(getUserFullName(user)).toEqual("Doe");
  });

  it("returns an empty string for a user with no first or last name", () => {
    const user = { firstName: null, lastName: null };
    expect(getUserFullName(user)).toEqual("");
  });
});
