import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register, login, and navigate", () => {
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

    // Automatically logged in after sign up
    cy.findByRole("button", { name: /Upload/i });
    cy.findByRole("link", { name: /analysis/i });
    cy.findByRole("link", { name: /supply chain/i });

    // Logout shows the login screen
    cy.findByRole("link", { name: /logout/i }).click();
    cy.findByRole("link", { name: /log in/i });

    // Log in
    cy.findByRole("link", { name: /log in/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /log in/i }).click();
    cy.findByRole("button", { name: /Upload/i });
    
    // Creating an account with an existing email fails and prompts user to login
    cy.findByRole("link", { name: /logout/i }).click();
    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();
    cy.findByText(/user already exists with this email/i);
    cy.findByRole("link", { name: /log in/i });
  });
});
  
describe ("Non-authenticated users", () => {
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
    cy.url().should("include", "/home");
  });
});
