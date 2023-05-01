import { faker } from "@faker-js/faker";

describe("Stripe", () => {
  describe("Add subscription", () => {
    afterEach(() => {
      cy.cleanupUser();
    });

    it("works", () => {
      // This bit of magic will manage preventing Cypress from breaking out of its Iframe
      // and redirecting to a new page when navigating through the Stripe Iframe
      // https://github.com/cypress-io/cypress/issues/19234
      cy.intercept("https://js.stripe.com/v3", (req) => {
        req.continue((res) => {
          res.body = res.body.replace(
            "window.top.location.href",
            "window.self.location.href"
          );
          res.send();
        });
      });

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

      // Navigate to subscriptions page
      cy.findByRole("link", { name: /Subscriptions/i })
        .should("be.visible")
        .click({ force: true });

      cy.wait(5000);

      cy.findByRole("link", { name: /Free Plan/i });
      cy.findByRole("link", { name: /Standard Plan/i }).as("standardPlan");
      cy.findByRole("link", { name: /Premium Plan/i });
      cy.findByRole("link", { name: /Enterprise Plan/i });

      cy.get("@standardPlan").click({ force: true });

      cy.wait(5000).get("h1").contains("Subscribe");

      // input into Stripe iFrame
      cy.getStripeElement("Field-numberInput").type("4000056655665556");
      cy.getStripeElement("Field-expiryInput").type("0824");
      cy.getStripeElement("Field-cvcInput").type("123");
      cy.getStripeElement("Field-postalCodeInput").type("90210");

      cy.findByRole("button").click();

      // The Payment Intent page dump after navigation
      cy.findByText(/thank you for your payment/i);

      // Navigate back to the subscription page and attempt to pay for another subscription
      cy.findByRole("link", { name: /Subscriptions/i })
        .should("be.visible")
        .click({ force: true });

      cy.findByRole("link", { name: /Standard Plan/i }).click({ force: true });

      cy.wait(5000);

      cy.getStripeElement("Field-numberInput").type("4000056655665556");
      cy.getStripeElement("Field-expiryInput").type("0824");
      cy.getStripeElement("Field-cvcInput").type("123");
      cy.getStripeElement("Field-postalCodeInput").type("90210");

      cy.findByRole("button").click();

      // We have not navigated away from the page -- the subscription was not successful
      cy.wait(5000).get("h1").contains("Subscribe");
    });
  });
});
