describe("File rSBOM Details", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  // Navigate to Details page via Dashboard
  // Navigate to Details page via Global Search
  // Navigate to Details page directly upon uploading file

  it("Navigates to rSBOM detail from History", () => {
    cy.createAndVerifyAccount();

    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000)
      .get(".MuiTableRow-root")
      .eq(1)
      .should("be.visible")
      .click({ force: true });
  });

  it("Allows user to download rSBOM JSON, copy object Id & ", () => {
    cy.createAndVerifyAccount();

    // Navigate to Details page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });
    cy.wait(1000)
      .get(".MuiTableRow-root")
      .eq(1)
      .should("be.visible")
      .click({ force: true });

    // Download test
    cy.findByText(/download rsbom/i)
      .should("be.visible")
      .click({ force: true });
    cy.findByText(/results for/i).then(($title) => {
      const result = $title
        .text()
        .split(/results for/i)[1]
        .trim();
      cy.readFile(`cypress/downloads/${result}.json`, {});
    });

    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.task("deleteFolder", downloadsFolder);

    // Copy ID test
    //focus and realClick used due to ongoing Cypress issue where DOM loses focus with clipboard actions, causing flakey test: https://github.com/cypress-io/cypress/issues/18198
    cy.findByText(/Object ID/i).then(($heading) => {
      const cveId = $heading.next().text();
      cy.findByLabelText("copy to clipboard")
        .should("be.visible")
        .focus()
        .realClick()
        .then(() => {
          cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
              expect(text).to.eq(cveId);
            });
          });
        });
    });
  });

  it("List view can be changed", () => {
    cy.createAndVerifyAccount();

    // Navigate to Details page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });
    cy.wait(1000)
      .get(".MuiTableRow-root")
      .eq(1)
      .should("be.visible")
      .click({ force: true });

    // Has results
    cy.findAllByTestId("cve-card-oriented").eq(0).should("be.visible");

    // before changes, list is in "row" orientation
    cy.findAllByTestId("cve-card-oriented")
      .eq(0)
      .should("be.visible")
      .should("have.css", "alignItems", "center");

    // clicking button switches button color
    cy.findByLabelText("View CVE Grid")
      .should("be.visible")
      .should("have.attr", "aria-pressed", "false")
      .click({ force: true })
      .should("have.attr", "aria-pressed", "true");

    // clicking button also switches view to "column" orientation
    cy.findAllByTestId("cve-card-oriented")
      .eq(0)
      .should("be.visible")
      .should("have.css", "alignItems", "normal");
  });

  it("Table entry populates sidebar", () => {
    cy.createAndVerifyAccount();

    // Navigate to Details page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });
    cy.wait(1000)
      .get(".MuiTableRow-root")
      .eq(1)
      .should("be.visible")
      .click({ force: true });

    //sidebar closed initially
    cy.findByText(/resources/i).should("not.exist");

    // clicking table entry opens sidebar
    cy.findAllByTestId("cve-card-oriented")
      .eq(0)
      .should("be.visible")
      .click({ force: true })
      // inside card
      .then(($card) => {
        cy.findByText(/resources/i).should("be.visible");

        // within sidebar
        cy.findByRole("presentation").within(() => {
          //name in card matches name in name in sidebar
          cy.wrap($card)
            .findByText(/CVE-*/i)
            .then(($name) => {
              cy.findByText($name.text());
            });
          // New Headings all Present in sidebar
          cy.findAllByText(/Source/i);
          cy.findByText(/Description/i);
          cy.findByText(/Resources/i);

          // buttons all there
          cy.findByText(/more details/i);
          cy.findByText(/share/i);
          cy.findByTestId("CloseIcon").click({ force: true });
        });
      });
  });
});
