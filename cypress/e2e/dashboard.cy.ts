describe("History", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("Works with Sorting, Filtering, and Pagination", () => {
    cy.createAndVerifyAccount();
    // Sorting
    cy.wait(1000)
      .findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        cy.findAllByRole("row")
          .eq(0)
          .within(() => {
            cy.findAllByRole("cell").eq(0).as("firstTableType");
          });
      });

    cy.findByText(/type/i).click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=type");

    cy.wait(1000)
      .findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        cy.findAllByRole("row")
          .eq(0)
          .within(() => {
            cy.findAllByRole("cell")
              .eq(0)
              .as("ascTableType")
              .then(($data) => {
                cy.wrap($data).should("not.equal", cy.get("@firstTableType"));
              });
          });
      });

    cy.findByText(/type/i).click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=-type");

    cy.wait(1000)
      .findAllByRole("rowgroup")
      .eq(1)
      .within(() => {
        cy.findAllByRole("row")
          .eq(0)
          .within(() => {
            cy.findAllByRole("cell")
              .eq(0)
              .then(($data) => {
                cy.wrap($data)
                  .should("not.equal", cy.get("@firstTableType"))
                  .should("not.equal", "@ascTableType");
              });
          });
      });

    // Pagination
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
