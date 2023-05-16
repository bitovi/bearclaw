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

      cy.wait(2000);

      cy.findByRole("link", { name: /Account/i });
      cy.findByRole("link", { name: /^Subscription$/i }).as("manage");

      cy.findByText(/No active subscription/i);

      cy.get("@manage").click({ force: true });

      cy.wait(5000).findByText(/ free plan/i);
      cy.findByText(/ standard plan/i);
      cy.findByText(/ premium plan/i);
      cy.findByText(/ enterprise plan/i);

      cy.findByText(/ standard plan/i).click({ force: true });

      cy.findByText(/get standard plan for/i);
      cy.findByText(/\$10/);
      cy.findByText(/subscribe to plan/i)
        .as("subscribe")
        .click({ force: true });

      // Pop up modal displaying
      cy.findByText(/choose plan/i);
      cy.findByText(/\$10 per month/i);
      cy.findByText(/dismiss/i);
      cy.findAllByRole("button")
        .contains(/^subscribe$/i)
        .click({ force: true });

      // On the payment form page
      cy.wait(5000).get("h1").contains("Subscribe");

      // input into Stripe iFrame
      cy.getStripeElement("Field-numberInput").type("4242424242424242");
      cy.getStripeElement("Field-expiryInput").type("0829");
      cy.getStripeElement("Field-cvcInput").type("123");
      cy.getStripeElement("Field-postalCodeInput").type("90210");

      cy.findByRole("button").click();
      cy.wait(3000);

      // The Overview screen after successful payment
      cy.findByText(/standard plan/i);
      cy.findByText(/current subscription plan/i);
      cy.findByText(/upgrade plan/i);

      cy.findByText(/manage payment settings/i);
      cy.findByText(/your next payment on/i);

      cy.findByText(/^invoice$/i);

      // Navigate back to the subscription manage page and select existing subscription
      cy.wait(2000)
        .findByRole("button", { name: /upgrade plan/i })
        .click({ force: true });

      cy.wait(2000).findByText(/ free plan/i);
      cy.findByText(/ standard plan/i);
      cy.findByText(/ premium plan/i);
      cy.findByText(/ enterprise plan/i);

      cy.findByText(/ standard plan/i).click({ force: true });

      // The same UI button now displays "cancel plan" button text
      cy.wait(2000).findByText(/get standard plan for/i);

      cy.findAllByRole("button")
        .contains(/cancel plan/i)
        .click({ force: true });

      // Modal displaying
      cy.findByText(/\$10 per month/i);
      cy.findByRole("button", { name: /^cancel$/i })
        .should("be.visible")
        .click({ force: true });

      cy.wait(2000).findByText(/cancelation on:/i);
      cy.findByText(/standard plan/i);
      cy.contains(/manage payment settings/i).should("not.exist");

      cy.findByRole("link", { name: /^Subscription$/i }).click({ force: true });

      cy.findByText(/ premium plan/i).click({ force: true });

      cy.wait(3000);

      cy.findAllByRole("button")
        .contains(/update plan/i)
        .click({ force: true });

      cy.wait(2000).findByText(/By changing to this plan/i);

      cy.findByRole("button", { name: /^update$/i })
        .should("be.visible")
        .click({ force: true });

      cy.wait(2000);

      cy.findByText(/premium plan/i);
      cy.findAllByRole("button").contains(/manage payment settings/i);
      cy.findByText(/^invoice$/i);
    });
  });
});
