describe("Global Search", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("Displays Search Page with Results and No Results", () => {
    cy.createAndVerifyAccount();

    // On the Dashboard
    cy.findByText(/welcome/i);
    cy.findByText(/recent activity/i);

    // Global search textbox
    cy.findByRole("textbox", { name: /search/i })
      .as("globalSearch")
      .should("be.visible")
      .type("a");

    cy.wait(1000).findByText(/search by data object/i);
    cy.findByText(/search by filename/i);

    const params = new URLSearchParams();
    params.append("filter", "contains(search,a)");
    // Confirm our filtering/searching is wiring up to the URL correctly
    cy.location("search").should("include", params.toString());

    cy.findByTestId(/search by data object-table/i).within(() => {
      cy.get("tbody").within(() => {
        cy.findAllByRole("row").should("have.length.gt", 0);
      });
    });
    cy.findByTestId(/search by filename-table/i).within(() => {
      cy.get("tbody").within(() => {
        cy.findAllByRole("row").should("have.length.gt", 0);
      });
    });

    // Random & empty string yields no results
    cy.get("@globalSearch").clear();
    cy.wait(1000).findByText(/sorry, no results found/i);

    // Add results before testing their disappearance
    cy.get("@globalSearch").type("a");
    cy.wait(1000).findByText(/search by data object/i);

    cy.get("@globalSearch").clear().type("adfjaklsdjflaksjdfsadf");
    cy.wait(1000).findByText(/sorry, no results found/i);
    //

    cy.get("@globalSearch").clear().type("a");

    cy.findByTestId(/search by data object-table/i).within(() => {
      // realClick allows us to engage the copy to clipboard behavior in the cy environment
      cy.findAllByTitle(/copy to clipboard/i)
        .eq(2)
        .realClick()
        .click({ force: true });
    });

    cy.window()
      .its("navigator.clipboard")
      .invoke("readText")
      .then((data) => {
        cy.get("@globalSearch").clear().type(data);
        const params = new URLSearchParams();
        params.append("filter", `contains(search,${data})`);
        // Confirm our filtering/searching is wiring up to the URL correctly
        cy.location("search").should("include", params.toString());
      });

    cy.wait(1000)
      .findByTestId(/search by data object-table/i)
      .within(() => {
        cy.get("tbody").within(() => {
          cy.findAllByRole("row").should("have.length", 1);
        });
      });
    cy.findByTestId(/search by filename-table/i).within(() => {
      cy.get("tbody").within(() => {
        cy.findAllByRole("row").should("have.length", 0);
      });
    });
  });

  it("Allows sorting and pagination of results", () => {
    cy.createAndVerifyAccount();

    // On the Dashboard
    cy.findByText(/welcome/i);
    cy.findByText(/recent activity/i);

    // Global search textbox
    cy.findByRole("textbox", { name: /search/i })
      .as("globalSearch")
      .should("be.visible")
      .type("a");

    cy.wait(1000).findByText(/search by data object/i);
    cy.findByText(/search by filename/i);

    // Sorting
    cy.wait(1000)
      .get("tbody")
      .eq(0)
      .within(() => {
        cy.get("a")
          .eq(1)
          .within(() => {
            cy.get("td").eq(1).as("firstTableDataObjectFileName");
          });
      });

    cy.findAllByText(/filename/i)
      .eq(0)
      .click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=filename");

    cy.wait(1000)
      .get("tbody")
      .eq(0)
      .within(() => {
        cy.get("a")
          .eq(0)
          .within(() => {
            cy.get("td")
              .eq(1)
              .as("ascTableDataObjectFileName")
              .then(($data) => {
                cy.wrap($data).should(
                  "not.equal",
                  cy.get("@firstTableDataObjectFileName")
                );
              });
          });
      });

    cy.findAllByText(/filename/i)
      .eq(0)
      .click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=-filename");

    cy.wait(1000)
      .get("tbody")
      .eq(0)
      .within(() => {
        cy.get("a")
          .eq(0)
          .within(() => {
            cy.get("td")
              .eq(0)
              .then(($data) => {
                cy.wrap($data)
                  .should("not.equal", cy.get("@firstTableDataObjectFileName"))
                  .should("not.equal", "@ascTableDataObjectFileName");
              });
          });
      });

    //  Pagination -- skipping until Global Search API is confirmed

    //   cy.wait(1000)
    //     .findAllByLabelText(/first page/i)
    //     .should("have.length", 2);

    //   cy.findAllByLabelText(/previous page/i).should("have.length", 2);

    //   cy.findAllByRole("link", { name: /last page/i }).should("have.length", 2);

    //   cy.findAllByRole("link", { name: /next page/i })
    //     .should("have.length", 2)
    //     .eq(0)
    //     .click();

    //   cy.location("search")
    //     .should("include", "page=2")
    //     .should("include", "perPage=10");

    //   cy.findAllByLabelText(/Rows per page/i)
    //     .should("have.length", 2)
    //     .eq(0)
    //     .click();

    //   cy.findAllByRole("link", { name: /show 25/i })
    //     .should("have.length", 2)
    //     .eq(0)
    //     .click();

    //   cy.location("search")
    //     .should("include", "page=1")
    //     .should("include", "perPage=25");
  });
});
