describe("Dashboard", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("Displays Recent Activity", () => {
    cy.createAndVerifyAccount();

    cy.findByText(/recent activity/i);
    cy.findByRole("table").within(() => {
      cy.findAllByRole("row").should("have.length", 4);
      cy.findByText(/severity/i);
      cy.findByText(/object id/i);
      cy.findByText(/type/i);
      cy.findByText(/file name/i);
      cy.findByText(/date/i);
      cy.findByText(/status/i);
    });
  });
});
