describe("Upload", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("allows upload from the main dashboard screen", () => {
    cy.createAndVerifyAccount();

    cy.wait(1000)

    cy.findByLabelText(/Select file to upload/i).selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'this_is_a_test.txt',
      lastModified: Date.now(),
    });
    cy.findAllByText(/Upload/i).click();

    cy.wait(5000);

    cy.findByText(/File uploaded successfully/i)
  });
});
