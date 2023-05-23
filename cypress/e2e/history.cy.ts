describe("History", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("Displays rSBOM history in a table", () => {
    cy.createAndVerifyAccount();

    // Navigate to History page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    // Inspect history trable
    cy.wait(5000)
      .findByRole("table")
      .within(() => {
        cy.contains("th", "Timestamp");
        cy.contains("th", "Data Object");
        cy.contains("th", "Filename");
        cy.contains("th", "ID");
        // Default fetching will have data rows
        cy.get("tbody").within(() => {
          cy.findAllByRole("row").should("have.length.gt", 0);
        });

        cy.get("td").then(($td) => {
          cy.wrap($td.get(6).innerHTML).as("searchText");
        });
      });

    // search for a string that will yield no results
    cy.wait(2000)
      .findByRole("textbox")
      .should("be.visible")
      .type("zdfasfdafdsfad");

    cy.get("tbody").within(() => {
      // no table row data to display
      cy.findAllByRole("row").should("have.length", 0);
    });

    cy.get("@searchText").then((txt: any) => {
      // search for a specifically captured ID value
      cy.wait(2000).findByRole("textbox").clear().type(txt);
    });

    cy.get("tbody").within(() => {
      // one result to display
      cy.findAllByRole("row").should("have.length", 1).click({ force: true });
    });

    // we are on the RSBOM Details page
    cy.findByTestId("table-title");
  });

  it("Allows user to download rSBOM JSON", () => {
    cy.createAndVerifyAccount();

    // Navigate to History page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000)
      .get("tbody")
      .within(() => {
        cy.findAllByRole("row").eq(3).click({ force: true });
      });

    cy.findByText(/download/i).click({ force: true });

    cy.findByTestId("table-title").then(($title) => {
      cy.readFile(`cypress/downloads/${$title.text()}.json`, {});
    });

    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.task("deleteFolder", downloadsFolder);
  });
});
