describe("Support", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("Displays Support page & form", () => {
    cy.createAndVerifyAccount();

    // Navigate to History page
    cy.findByRole("link", { name: /Support/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/how can we help\?/i);

    cy.wait(2000);

    cy.findByRole("textbox", { name: /subject/i }).type("I have a problem.");

    cy.findByRole("textbox", { name: /additional details/i }).type(
      "As I said before, I have a problem."
    );

    cy.findByRole("button", { name: /submit/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/thank you/i);

    cy.wait(1000)
      .findByRole("button", { name: /submit/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/how can we help\?/i);
  });
});
