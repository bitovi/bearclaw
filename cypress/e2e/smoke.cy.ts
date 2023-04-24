import { faker } from "@faker-js/faker";

const createUserInBrowserAndLogin = () => {
  const loginForm = {
    email: `${faker.internet.userName()}-test@bigbear.ai`,
    password: faker.internet.password(),
  };

  cy.then(() => ({ email: loginForm.email })).as("user");

  cy.viewport(1280, 800);
  cy.visitAndCheck("/home");

  // Sign up
  cy.findByRole("link", { name: /sign up/i }).click();

  cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
  cy.findByLabelText(/password/i).type(loginForm.password);
  cy.findByRole("button", { name: /create account/i }).click();

  // Need to verify email
  cy.findByText(/Please verify your email address/i);
  cy.visitAndCheck("/fakeMail");
  cy.findByTestId(loginForm.email)
    .findByRole("link", { name: /Verify your email address/i })
    .click();
  cy.findByText(/verified successfully/i);

  // Automatically logged in after sign up
  cy.findByRole("link", { name: /analysis/i });
  cy.findByRole("link", { name: /supply chain/i });

  return loginForm;
};

describe("join and authenticate tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register, login, and navigate", () => {
    const loginForm = createUserInBrowserAndLogin();

    // Logout shows the login screen
    cy.wait(3000);
    cy.findByRole("link", { name: /logout/i }).click();
    cy.findByRole("button", { name: /log in/i });
    cy.url().should("include", "/login");

    // Log in
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /log in/i }).click();
    cy.findByRole("button", { name: /Upload/i });
    cy.findByRole("link", { name: /logout/i }).click();

    // Creating an account with an existing email fails and prompts user to login
    cy.visitAndCheck("/join");
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();
    cy.findByText(/user already exists with this email/i);
    cy.findByRole("link", { name: /log in/i });
  });
});

describe("Non-authenticated users", () => {
  it("should fail creating short passwords (less than 8 characters)", () => {
    cy.viewport(1280, 800);
    cy.visitAndCheck("/join");
    const loginForm = {
      email: `${faker.internet.userName()}-test@bigbear.ai`,
      password: faker.internet.password(7),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();
    cy.findByText(/too short/i);
  });

  it("should not be able to access authenticated page if not logged in", () => {
    cy.viewport(1280, 800);
    cy.visit("/analysis");
    cy.url().should("include", "/login");
  });
});
