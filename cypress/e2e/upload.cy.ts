describe("Upload", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("allows upload from the main dashboard screen", () => {
    cy.createAndVerifyAccount();

    cy.wait(1000);

    cy.findByLabelText(/to upload/i).selectFile(
      {
        contents: Cypress.Buffer.from("file contents"),
        fileName: "this_is_a_test.txt",
        lastModified: Date.now(),
      },
      { action: "drag-drop" }
    );
    cy.wait(1000)
      .findAllByText(/Upload/i)
      .should("be.visible")
      .click({ force: true });

    cy.wait(5000);

    cy.findAllByText(/file uploaded fail/i).should("have.length", 0);

    cy.findByText(/File uploaded successfully/i);
  });
});
