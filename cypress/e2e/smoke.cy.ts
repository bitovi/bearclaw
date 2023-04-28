import { faker } from "@faker-js/faker";

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test on uncaught exceptions
  // Our server throws for certain errors like invalid password, but it should not fail the test
  return false;
});

type LoginData = {
  email: string;
  password: string;
  resetPassword: string;
};

function createLoginData(): LoginData {
  return {
    email: `${faker.internet.userName()}-test@bigbear.ai`,
    password: faker.internet.password(),
    resetPassword: faker.internet.password(),
  };
}

function createAndVerifyAccount({ email, password }: LoginData) {
  cy.findByRole("textbox", { name: /email/i }).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole("button", { name: /create account/i }).click();
  cy.findByRole("link", { name: /View verification emails here/i }).click();
  cy.findByTestId(email)
    .findByRole("link", { name: /verify your email/i })
    .click();
  cy.findByText(/verified successfully/i);
}

describe("join and authenticate tests", () => {
  beforeEach(() => {
    cy.resetDB();
  });

  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register, login, and navigate", () => {
    const loginForm = createLoginData();

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.viewport(1280, 800);
    cy.visitAndCheck("/home");

    // Sign up
    cy.findByRole("link", { name: /sign up/i }).click();
    createAndVerifyAccount(loginForm);

    // Automatically logged in after sign up
    cy.findByRole("link", { name: /analysis/i });
    cy.findByRole("link", { name: /supply chain/i });

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

  it("should allow you to reset password", () => {
    const loginForm = createLoginData();

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.viewport(1280, 800);
    cy.visitAndCheck("/join");
    createAndVerifyAccount(loginForm);

    cy.wait(100);
    cy.findByRole("link", { name: /logout/i }).click();
    cy.findByRole("link", { name: /forgot password/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByRole("button", { name: /password reset/i }).click();
    cy.findByRole("link", { name: /View emails here/i }).click();
    cy.findAllByTestId(loginForm.email)
      .first()
      .findAllByRole("link", { name: /reset your password/i })
      .click();

    cy.wait(100);
    cy.findByLabelText(/create new password/i).type(loginForm.resetPassword);
    cy.findByRole("button", { name: /reset password/i }).click();
    cy.findByText(/your password has been reset/i);
    cy.findByRole("link", { name: /login/i }).click();

    // Old password no longer works
    cy.wait(100);
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /log in/i }).click();
    cy.findByText(/invalid email or password/i);

    // New password works
    cy.wait(100);
    cy.findByLabelText(/password/i)
      .clear()
      .type(loginForm.resetPassword);
    cy.findByRole("button", { name: /log in/i }).click();
    cy.findByRole("link", { name: /analysis/i });
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
