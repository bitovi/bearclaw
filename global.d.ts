import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
// resolves issue in tests wherein Typescript didn't detect all the expected properties on asserts against elements, like expect(<HTMLElement>).toHaveClass()

declare global {
  namespace jest {
    interface Matchers<R = void>
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}
