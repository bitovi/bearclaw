import { toTitleCase } from "./toTitleCase";

it("should title case everything", () => {
  expect(toTitleCase("moo")).toBe("Moo");
  expect(toTitleCase("moo cow")).toBe("Moo Cow");
  expect(toTitleCase("mooCow")).toBe("Moo Cow");
  expect(toTitleCase("mooCow1")).toBe("Moo Cow 1");
  expect(toTitleCase("2mooCows")).toBe("2 Moo Cows");
});
