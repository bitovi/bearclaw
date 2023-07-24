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
        cy.findAllByRole("columnheader").contains(/date/i);
        cy.findAllByRole("columnheader").contains(/Object Id/i);
        cy.findAllByRole("columnheader").contains(/file name/i);
        cy.findAllByRole("columnheader").contains(/id/i);
        cy.findAllByRole("columnheader").contains(/type/i);
        cy.findAllByRole("columnheader").contains(/status/i);

        // Default fetching will have data rows
        cy.findAllByRole("rowgroup")
          .eq(1)
          .within(() => {
            cy.findAllByRole("row").should("have.length.gt", 0);
          });

        // realClick allows us to engage the copy to clipboard behavior in the cy environment
        cy.findAllByTitle(/copy to clipboard/i)
          .eq(2)
          .realClick()
          .click({ force: true });
      });

    cy.findByText(/select a field/i).click();

    cy.findByRole("option", { name: /data object/i }).click({ force: true });

    // search for a string that will yield no results
    cy.get("main").within(() => {
      cy.findByRole("textbox").as("searchBox").type("zdfasfdafdsfad");
    });

    const params = new URLSearchParams();
    params.append("filter", "contains(_id,zdfasfdafdsfad)");
    // Confirm our filtering/searching is wiring up to the URL correctly
    cy.location("search").should("include", params.toString());

    cy.findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        // no table row data to display
        cy.findAllByRole("row").should("have.length", 0);
      });

    // read from clipboard into search bar of table
    cy.window()
      .its("navigator.clipboard")
      .invoke("readText")
      .then(async (data) => {
        const result = await data;
        cy.get("@searchBox").clear().type(result);
        const params = new URLSearchParams();
        params.append("filter", `contains(_id,${result})`);
        // Confirm our filtering/searching is wiring up to the URL correctly
        cy.location("search").should("include", params.toString());
      });

    cy.wait(1000)
      .findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        // one result to display
        cy.findAllByRole("row").should("have.length", 1).click({ force: true });
      });

    // we are on the RSBOM Details page
    cy.findByText(/CVE List/i);
  });

  it("Allows user to download rSBOM JSON", () => {
    cy.createAndVerifyAccount();

    // Navigate to History page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000)
      .findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        cy.findAllByRole("row").eq(3).click({ force: true });
      });

    cy.wait(1000)
      .findByText(/download/i)
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
  });

  it("Allows sorting and pagination of results", () => {
    cy.createAndVerifyAccount();

    // Navigate to History page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    // Sorting
    cy.wait(1000)
      .findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        cy.get("a")
          .eq(0)
          .within(() => {
            cy.findAllByRole("cell")
              .eq(1)
              .invoke("text")
              .as("firstTableFileName", { type: "static" });
          });
      });

    cy.findByRole("table").within(() => {
      cy.findByText(/File name/i).click({ force: true });
    });

    cy.wait(1000).location("search").should("include", "sort=filename");

    cy.wait(1000)
      .findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        cy.get("a")
          .eq(0)
          .within(() => {
            cy.findAllByRole("cell")
              .eq(1)
              .invoke("text")
              .as("ascTableFileName", { type: "static" });
          });
      });

    cy.get("@ascTableFileName").should(
      "not.equal",
      cy.get("@firstTableFileName")
    );

    cy.findByText(/File name/i).click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=-filename");

    cy.wait(1000)
      .findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        cy.get("a")
          .eq(0)
          .within(() => {
            cy.findAllByRole("cell")
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
