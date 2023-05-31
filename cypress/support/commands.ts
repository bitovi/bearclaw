import { faker } from "@faker-js/faker";
import "cypress-real-events";
type LoginData = {
  email: string;
  password: string;
  resetPassword: string;
};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a random user. Yields the user and adds an alias to the user
       *
       * @returns {typeof login}
       * @memberof Chainable
       * @example
       *    cy.login()
       * @example
       *    cy.login({ email: 'whatever@example.com' })
       */
      login: typeof login;

      /**
       * Deletes the current @user and organization
       *
       * @returns {typeof cleanupAccount}
       * @memberof Chainable
       * @example
       *    cy.cleanupAccount()
       * @example
       *    cy.cleanupAccount({ email: 'whatever@example.com' })
       */
      cleanupAccount: typeof cleanupAccount;

      /**
       * Extends the standard visit command to wait for the page to load
       *
       * @returns {typeof visitAndCheck}
       * @memberof Chainable
       * @example
       *    cy.visitAndCheck('/')
       *  @example
       *    cy.visitAndCheck('/', 500)
       */
      visitAndCheck: typeof visitAndCheck;

      /**
       * Searches within Stripe loaded Iframe for specific input
       *
       * @returns {typeof getStripeElement}
       * @memberof Chainable
       * @example
       *    getStripeElement("Field-numberInput").type('test')
       *  @example
       *    getStripeElement("Field-numberOpt", combobox).select();
       */
      getStripeElement: typeof getStripeElement;

      /**
       * Creates user account, verifies, and logs user in
       *
       * @returns {typeof LoginData}
       * @memberof Chainable
       * @example
       *    const loginDetails = createAndVeryAccount();
       */
      createAndVerifyAccount: typeof createAndVerifyAccount;
    }
  }
}

function login({
  email = faker.internet.email(undefined, undefined, "example.com"),
}: {
  email?: string;
} = {}) {
  cy.then(() => ({ email })).as("user");
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}"`
  ).then(({ stdout }) => {
    const cookieValue = stdout
      .replace(/.*<cookie>(?<cookieValue>.*)<\/cookie>.*/s, "$<cookieValue>")
      .trim();
    cy.setCookie("__session", cookieValue);
  });
  return cy.get("@user");
}

function cleanupAccount({ email }: { email?: string } = {}) {
  if (email) {
    deleteUserByEmail(email);
    deleteOrganizationByEmail(email);
  } else {
    cy.get("@user").then((user) => {
      const email = (user as { email?: string }).email;
      if (email) {
        deleteUserByEmail(email);
        deleteOrganizationByEmail(email);
      }
    });
  }
  cy.clearCookie("__session");
}

function deleteUserByEmail(email: string) {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts "${email}"`
  );
  cy.clearCookie("__session");
}

function deleteOrganizationByEmail(email: string) {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/delete-organization.ts "${email}"`
  );
}

// We're waiting a second because of this issue happen randomly
// https://github.com/cypress-io/cypress/issues/7306
// Also added custom types to avoid getting detached
// https://github.com/cypress-io/cypress/issues/7306#issuecomment-1152752612
// ===========================================================
function visitAndCheck(url: string, waitTime: number = 1000) {
  cy.visit(url);
  cy.location("pathname").should("contain", url).wait(waitTime);
}

function getStripeElement(fieldName: string, type?: string) {
  if (Cypress.config("chromeWebSecurity")) {
    throw new Error(
      "To get stripe element `chromeWebSecurity` must be disabled"
    );
  }

  const selector = `${type || "input"}[id=${fieldName}]`;

  return cy
    .get("iframe")
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap)
    .find(selector);
}

function createLoginData(): LoginData {
  return {
    email: `${faker.internet.userName()}-test@bigbear.ai`,
    password: faker.internet.password(),
    resetPassword: faker.internet.password(),
  };
}

function createAndVerifyAccount(
  credentials?: LoginData,
  destination = "/home"
) {
  let _loginForm = credentials;
  if (!credentials) {
    _loginForm = createLoginData();
  }
  const loginForm = _loginForm as LoginData;

  cy.then(() => ({ email: loginForm.email })).as("user");

  cy.viewport(1280, 800);
  cy.visitAndCheck(destination);

  if (destination === "/home") {
    cy.findByRole("link", { name: /sign up/i })
      .should("be.visible")
      .click({ force: true });
  }

  cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
  cy.findByLabelText(/password/i).type(loginForm.password);
  cy.findByRole("button", { name: /create account/i })
    .should("be.visible")
    .click({ force: true });
  cy.findByRole("link", { name: /View verification emails here/i })
    .should("be.visible")
    .click({ force: true });

  cy.findByTestId(loginForm.email)
    .findByRole("link", { name: /verify your email/i })
    .should("be.visible")
    .click({ force: true });

  cy.findByText(/verified successfully/i);
  cy.wait(1000);
  cy.findByRole("link", { name: /Continue/i }).click();
  cy.findByText(/welcome/i);
}

Cypress.Commands.add("login", login);
Cypress.Commands.add("cleanupAccount", cleanupAccount);
Cypress.Commands.add("visitAndCheck", visitAndCheck);
Cypress.Commands.add("getStripeElement", getStripeElement);
Cypress.Commands.add("createAndVerifyAccount", createAndVerifyAccount);
