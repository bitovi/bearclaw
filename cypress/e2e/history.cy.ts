describe("History", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("Displays rSBOM history in a table", () => {
    // give Cypress permissions to read clipboard
    Cypress.automation("remote:debugger:protocol", {
      command: "Browser.grantPermissions",
      params: {
        permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
        origin: window.location.origin,
      },
    }).catch((e) => {
      console.log("error", e.message);
    });

    cy.createAndVerifyAccount();

    // Navigate to History page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    // Inspect history table
    // padding in time as the endpoint is slow
    cy.wait(5000)
      .findByRole("table")
      .within(() => {
        cy.contains("th", "Timestamp");
        cy.contains("th", "Data Object");
        cy.contains("th", "Filename");
        cy.contains("th", "ID");
        cy.contains("th", "Type");
        cy.contains("th", "Status");
        // Default fetching will have data rows
        cy.get("tbody").within(() => {
          cy.findAllByRole("row").should("have.length.gt", 0);
        });

        // realClick allows us to engage the copy to clipboard behavior in the cy environment
        cy.findAllByRole("button").eq(2).realClick();
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

    // read from clipboard into search bar of table
    cy.window()
      .its("navigator.clipboard")
      .invoke("readText")
      .then((data) => {
        cy.findByRole("textbox").clear().type(data);
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

    cy.wait(1000)
      .findByText(/download/i)
      .should("be.visible")
      .click({ force: true });

    cy.findByTestId("table-title").then(($title) => {
      cy.readFile(`cypress/downloads/${$title.text()}.json`, {});
    });

    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.task("deleteFolder", downloadsFolder);
  });
});
