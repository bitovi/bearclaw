import { faker } from "@faker-js/faker";

describe("History", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("Displays rSBOM history in a table", () => {
    //  // Create user, Login, and navigate to Home page
    const loginForm = {
      email: `${faker.internet.userName()}-test@bigbear.ai`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.viewport(1280, 800);
    cy.visitAndCheck("/home");

    // Sign up
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    // Need to verify email
    cy.findByText(/Please verify your email address/i);
    cy.visitAndCheck("/fakeMail");
    cy.findByTestId(loginForm.email)
      .findByRole("link", { name: /Verify your email address/i })
      .click();
    cy.findByText(/verified successfully/i);

    // Automatically logged in after sign up
    cy.findByRole("link", { name: /analysis/i });
    cy.findByRole("link", { name: /supply chain/i });

    // //

    // Navigate to History page
    cy.findByRole("link", { name: /History/i })
      .should("be.visible")
      .click({ force: true });

    // Inspect history trable
    cy.findByRole("table").within(() => {
      cy.contains("th", "Timestamp");
      cy.contains("th", "Data Object");
      cy.contains("th", "Filename");
      cy.contains("th", "ID");
      // Default fetching will have data rows
      cy.get("tbody").within(() => {
        cy.get("tr").should("have.length.gt", 0);
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
      cy.get("tr").should("have.length", 0);
    });

    cy.get("@searchText").then((txt: any) => {
      // search for a specifically captured ID value
      cy.wait(2000).findByRole("textbox").clear().type(txt);
    });

    cy.get("tbody").within(() => {
      // one result to display
      cy.get("tr").should("have.length", 1).click({ force: true });
    });

    // we are on the RSBOM Details page
    cy.findByText(/some complex thing/i);
  });
});
