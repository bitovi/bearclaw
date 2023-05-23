import { faker } from "@faker-js/faker";

describe("Support", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("Displays Support page & form", () => {
    //  // Create user, Login, and navigate to Home page
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

    // //

    // Navigate to History page
    cy.findByRole("link", { name: /Support/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/how can we help\?/i);
    cy.findByRole("textbox", { name: /subject/i }).as("subject");
    cy.findByRole("textbox", { name: /details/i }).as("details");

    cy.get("@subject").type("I have a problem.");
    cy.get("@details").type("As I said before, I have a problem.");

    cy.findByRole("button", { name: /submit/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/thank you/i);

    cy.findByRole("button", { name: /submit/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/how can we help\?/i);
  });
});
