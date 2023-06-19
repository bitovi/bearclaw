describe("History", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("Displays rSBOM history in a table", () => {
    cy.createAndVerifyAccount();

    // Navigate to History page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    // Inspect history table
    // padding in time as the endpoint is slow
    cy.wait(1000)
      .findByRole("table")
      .within(() => {
        cy.contains("th", "Date");
        cy.contains("th", "Data Object");
        cy.contains("th", "Filename");
        cy.contains("th", "Id");
        cy.contains("th", "Type");
        cy.contains("th", "Status");
        // Default fetching will have data rows
        cy.get("tbody").within(() => {
          cy.findAllByRole("row").should("have.length.gt", 0);
        });

        // realClick allows us to engage the copy to clipboard behavior in the cy environment
        cy.findAllByTitle(/copy to clipboard/i)
          .eq(2)
          .realClick()
          .click({ force: true });
      });

    cy.findByLabelText(/type/i).click();

    cy.findByRole("option", { name: /data object/i }).click();

    cy.findByTestId(/lists-table/i).as("historyTable");

    // search for a string that will yield no results
    cy.wait(2000)
      .get("@historyTable")
      .within(() => {
        cy.findByRole("textbox").type("zdfasfdafdsfad");
      });

    const params = new URLSearchParams();
    params.append("filter", "contains(dataObject,zdfasfdafdsfad)");
    // Confirm our filtering/searching is wiring up to the URL correctly
    cy.location("search").should("include", params.toString());

    cy.get("tbody").within(() => {
      // no table row data to display
      cy.findAllByRole("row").should("have.length", 0);
    });

    // read from clipboard into search bar of table
    cy.window()
      .its("navigator.clipboard")
      .invoke("readText")
      .then((data) => {
        cy.get("@historyTable").within(() => {
          cy.findByRole("textbox").clear().type(data);
        });
        const params = new URLSearchParams();
        params.append("filter", `contains(dataObject,${data})`);
        // Confirm our filtering/searching is wiring up to the URL correctly
        cy.location("search").should("include", params.toString());
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

  it("Allows sorting and pagination of results", () => {
    cy.createAndVerifyAccount();

    // Navigate to History page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    // Sorting
    cy.wait(1000)
      .get("tbody")
      .within(() => {
        cy.get("a")
          .eq(0)
          .within(() => {
            cy.get("td").eq(1).as("firstTableFileName");
          });
      });

    cy.findByText(/filename/i).click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=filename");

    cy.wait(1000)
      .get("tbody")
      .within(() => {
        cy.get("a")
          .eq(0)
          .within(() => {
            cy.get("td")
              .eq(1)
              .as("ascTableFileName")
              .then(($data) => {
                cy.wrap($data).should(
                  "not.equal",
                  cy.get("@firstTableFileName")
                );
              });
          });
      });

    cy.findByText(/filename/i).click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=-filename");

    cy.wait(1000)
      .get("tbody")
      .within(() => {
        cy.get("a")
          .eq(0)
          .within(() => {
            cy.get("td")
              .eq(0)
              .then(($data) => {
                cy.wrap($data)
                  .should("not.equal", cy.get("@firstTableFileName"))
                  .should("not.equal", "@ascTableFileName");
              });
          });
      });

    //Pagination
    cy.wait(1000).findByLabelText(/first page/i);

    cy.findByLabelText(/previous page/i);

    cy.findByRole("link", { name: /last page/i });

    cy.findByRole("link", { name: /next page/i }).click();

    cy.location("search")
      .should("include", "page=2")
      .should("include", "perPage=10");

    cy.findByLabelText(/Rows per page/i).click();

    cy.findByRole("link", { name: /show 25/i }).click();

    cy.location("search")
      .should("include", "page=1")
      .should("include", "perPage=25");
  });
});
