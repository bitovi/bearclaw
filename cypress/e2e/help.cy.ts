describe("Help", () => {
  it("Displays Help page & form", () => {
    cy.visitAndCheck("/login");

    // Navigate to History page
    cy.findByRole("link", { name: /forgot password/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000)
      .findByRole("link", { name: /need help/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/^help$/i);

    cy.get("input[name='selectCategory']")
      .as("selectField")
      .should("have.value", "general");
    cy.wait(1000)
      .findByLabelText(/select category/i)
      .click({ force: true });
    cy.findAllByText("File Upload").click({ force: true });

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

    cy.findByText(/^help$/i);
  });
});
