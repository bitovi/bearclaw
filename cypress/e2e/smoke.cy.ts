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

describe("join and authenticate tests", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("should allow you to register, login, MFA, and navigate", () => {
    const loginForm = createLoginData();
    cy.createAndVerifyAccount(loginForm);

    // Automatically logged in after sign up
    cy.findByRole("link", { name: /support/i });

    // Logout shows the login screen
    cy.wait(3000);
    cy.findAllByRole("link", { name: /logout/i })
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("button", { name: /log in/i });
    cy.url().should("include", "/login");

    // Log in without MFA
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /log in/i })
      .should("be.visible")
      .click({ force: true });
    cy.findAllByRole("link", { name: /logout/i });

    // Setup email MFA
    cy.findAllByRole("link", { name: /Account/i })
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.findAllByRole("link", { name: /Settings/i })
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("button", { name: /Enable Email MFA/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/You have been sent a 6 digit token/i);
    cy.visit("/fakeMail");
    cy.findAllByTestId(/token/i)
      .first()
      .then((t) => {
        const token = t.text();

        cy.go("back");
        cy.wait(1000);
        cy.findByRole("textbox", { name: /mfa token/i }).type(token, {
          force: true,
        });
        cy.findByRole("button", { name: /verify/i })
          .should("be.visible")
          .click({ force: true });
        cy.findByText(/Email MFA Enabled/i);
      });

    // Logout and verify MFA
    cy.findAllByRole("link", { name: /logout/i })
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /log in/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/You have been sent a 6 digit token/i);
    cy.visit("/fakeMail");

    cy.findAllByTestId(loginForm.email)
      .first()
      .findByTestId(/token/i)
      .then((t) => {
        const token = t.text();

        cy.go("back");
        cy.wait(1000);
        cy.findByRole("textbox", { name: /token/i }).type(token, {
          force: true,
        });
        cy.findByRole("button", { name: /complete/i })
          .should("be.visible")
          .click({ force: true });

        cy.findAllByRole("link", { name: /logout/i });
      });

    // Disable MFA
    cy.findAllByRole("link", { name: /Account/i })
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.findAllByRole("link", { name: /Settings/i })
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("button", { name: /Disable Email MFA/i })
      .should("be.visible")
      .click({ force: true });
    cy.findByText(/Are you sure you want to disable email MFA/i);
    cy.findByRole("button", { name: /Disable/i })
      .should("be.visible")
      .click({ force: true });
    cy.findByText(/Email MFA: Off/i);

    cy.findAllByRole("link", { name: /logout/i })
      .first()
      .should("be.visible")
      .click({ force: true });

    // Creating an account with an existing email fails and prompts user to login
    cy.visitAndCheck("/join");
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findAllByRole("button", { name: /sign up/i })
      .eq(0)
      .should("be.visible")
      .click({ force: true });
    cy.findByText(/user already exists with this email/i);
    cy.findByRole("link", { name: /sign in/i });
  });

  it("should allow you to reset password", () => {
    const loginForm = createLoginData();
    cy.createAndVerifyAccount(loginForm, "/join");
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.wait(100);
    cy.findAllByRole("link", { name: /logout/i })
      .first()
      .should("be.visible")
      .click({ force: true });
    cy.findByRole("link", { name: /forgot password/i })
      .should("be.visible")
      .click({ force: true });
    cy.wait(500)
      .findByRole("textbox", { name: /email/i })
      .type(loginForm.email);
    cy.findByRole("button", { name: /password reset/i })
      .should("be.visible")
      .click({ force: true });
    cy.findByRole("link", { name: /View emails here/i })
      .should("be.visible")
      .click({ force: true });
    cy.findAllByTestId(loginForm.email)
      .first()
      .findAllByRole("link", { name: /reset your password/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(500)
      .findByLabelText(/create new password/i)
      .type("1");
    cy.findByRole("button", { name: /reset password/i })
      .should("be.visible")
      .click({ force: true });
    cy.findByText(/too short/i);
    cy.wait(500)
      .findByLabelText(/create new password/i)
      .clear()
      .type(loginForm.resetPassword);
    cy.findByRole("button", { name: /reset password/i })
      .should("be.visible")
      .click({ force: true });
    cy.findByText(/your password has been reset/i);
    cy.findByRole("link", { name: /login/i })
      .should("be.visible")
      .click({ force: true });

    // Old password no longer works
    cy.wait(100);
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.wait(500)
      .findByLabelText(/password/i)
      .type(loginForm.password);
    cy.findByRole("button", { name: /log in/i })
      .should("be.visible")
      .click({ force: true });
    cy.findByText(/invalid email or password/i);

    // New password works
    cy.wait(500)
      .findByLabelText(/password/i)
      .clear()
      .type(loginForm.resetPassword);
    cy.findByRole("button", { name: /log in/i })
      .should("be.visible")
      .click({ force: true });
    cy.findByRole("link", { name: /dashboard/i });
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
    cy.findAllByRole("button", { name: /sign up/i })
      .eq(0)
      .should("be.visible")
      .click({ force: true });
    cy.findByText(/too short/i);
  });

  // skiping as 'analysis' is not a page on the app
  it.skip("should not be able to access authenticated page if not logged in", () => {
    cy.viewport(1280, 800);
    cy.visit("/analysis");
    cy.url().should("include", "/login");
  });
});
