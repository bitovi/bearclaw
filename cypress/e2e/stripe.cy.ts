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

      cy.findByRole("link", { name: /Overview/i });
      cy.findByRole("link", { name: /Manage/i }).as("manage");

      cy.findByRole("heading").contains(/Plan Information/i);
      cy.findByText(/No plan information to display/i);

      cy.get("@manage").click({ force: true });

      cy.findByText(/free plan/i);
      cy.findByText(/standard plan/i);
      cy.findByText(/premium plan/i);
      cy.findByText(/enterprise plan/i);

      cy.findAllByRole("button", { name: /choose plan/i })
        // Don't select the "Free Tier" as its currently an edge case which will navigate the user back
        .eq(1)
        .click({ force: true });

      cy.findByText(/\$10 per month/i);
      cy.findByText(/dismiss/i);
      cy.findByText(/subscribe/i).as("subscribe");

      cy.get("@subscribe").click({ force: true });

      cy.wait(5000).get("h1").contains("Subscribe");

      // input into Stripe iFrame
      cy.getStripeElement("Field-numberInput").type("4242424242424242");
      cy.getStripeElement("Field-expiryInput").type("0829");
      cy.getStripeElement("Field-cvcInput").type("123");
      cy.getStripeElement("Field-postalCodeInput").type("90210");

      cy.findByRole("button").click();
      cy.wait(3000);

      // The Payment Intent page dump after navigation
      cy.findByText(/thank you for your payment!/i);

      // Navigate back to the subscription page and attempt to pay for another subscription
      cy.findByRole("link", { name: /overview/i })
        .should("be.visible")
        .click({ force: true });

      cy.findByText(/^Subscription type: Standard Plan$/i);
      cy.findByText(/^Subscription status: active$/i);

      cy.findByRole("link", { name: /manage/i })
        .should("be.visible")
        .click({ force: true });

      cy.wait(2000)
        .findByRole("button", { name: /cancel plan/i })
        .should("be.visible")
        .click({ force: true });

      cy.findByText(/\$10 per month/i);

      cy.findByRole("button", { name: /^cancel$/i })
        .should("be.visible")
        .click({ force: true });

      cy.findByText(/ENDING/i);
    });
  });
});
