describe("Legal", { testIsolation: true }, () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("Displays legal page with privacy and terms copy", () => {
    cy.createAndVerifyAccount();

    // Navigate to Legal page
    cy.findByRole("link", { name: /account/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("link", { name: /legal/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000)
      .get("[aria-label='privacy-button-selected']")
      .should("be.visible");

    cy.get("[aria-label='terms-button-unselected']").should("be.visible");

    cy.findByText(/this is privacy copy/i);

    cy.findAllByRole("link").contains(/privacy & policy/i);
    cy.findAllByRole("link")
      .contains(/terms & conditions/i)
      .click({
        force: true,
      });

    cy.wait(1000);
    cy.location("search").should("contain", "pageType=terms");
    cy.get("[aria-label='terms-button-selected']").should("be.visible");
    cy.get("[aria-label='privacy-button-unselected']").should("be.visible");

    cy.findByText(/this is terms and conditions copy/i);
  });
});
