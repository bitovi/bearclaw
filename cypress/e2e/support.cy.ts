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

    cy.findByText(/support form/i);

    cy.wait(2000);

    cy.get("input[name='selectCategory']")
      .as("selectField")
      .should("have.value", "general");
    cy.findByLabelText(/select category/i).click();
    cy.findAllByText("File Upload").click();

    cy.wait(500).get("@selectField").should("have.value", "file_upload");

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

    cy.findByText(/support form/i);
  });
});
