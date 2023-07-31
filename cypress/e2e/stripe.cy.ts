describe("Stripe", () => {
  describe("Add subscription", () => {
    afterEach(() => {
      cy.cleanupAccount();
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

      cy.createAndVerifyAccount();

      // Navigate to subscriptions page
      cy.findByRole("link", { name: /Subscriptions/i })
        .should("be.visible")
        .click({ force: true });

      cy.wait(2000);

      cy.findByRole("link", { name: /Overview/i });
      cy.findAllByRole("link", { name: /^Subscription$/i })
        .last()
        .as("manage");

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

      cy.findByRole("button", { name: /subscribe/i }).click();
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

      cy.findAllByRole("link", { name: /^Subscription$/i })
        .last()
        .click({ force: true });

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
