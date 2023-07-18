describe("User Management & Invitation", () => {
  const ownerAccount = {
    email: "ownerAccount-test@bigbear.ai",
    password: "testPassword",
    resetPassword: "testPassword2",
  };

  const newUserAccount = {
    email: "newUserAccount-test@bigbear.ai",
    password: "testPassword",
    resetPassword: "testPassword2",
  };

  const existingUserAccount = {
    email: "existingUserAccount-test@bigbear.ai",
    password: "testPassword",
    resetPassword: "testPassword2",
  };

  const differentOwnerAccount = {
    email: "differentOwnerAccount-test@bigbear.ai",
    password: "myreallystrongpassword",
    resetPassword: "myreallystrongpassword",
  };

  before(() => {
    cy.deleteOrgsAndUsers();
  });

  after(() => {
    cy.deleteOrgsAndUsers();
  });

  it("Invite user", () => {
    cy.createAndVerifyAccount(ownerAccount);

    cy.findByRole("link", { name: /user accounts/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/user accounts/i);

    // length of 1 as the Owner will be the only listing displayed
    cy.get("tbody > tr").should("have.length", 1);

    cy.findAllByRole("button", { name: /remove/i })
      .should("have.length", 1)
      .eq(0)
      .should("be.disabled");
    cy.wait(500)
      .findByRole("button", { name: /add user/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/add user/i);

    cy.focused().type(newUserAccount.email);

    cy.findByRole("button", { name: /send invite/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/invitation successfully sent/i);
  });

  it("Accept invitation -- New User", () => {
    cy.visit("/fakeMail");

    cy.findByTestId(`${newUserAccount.email}-link`)
      .contains(/join here/i)
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/create an account/i)
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("textbox", { name: /email/i })
      .should("be.visible")
      .should("have.value", newUserAccount.email)
      .should("have.attr", "readonly", "readonly");

    cy.wait(500)
      .findByLabelText(/password/i)
      .should("be.visible")
      .type(newUserAccount.password);

    cy.findAllByRole("button", { name: /sign up/i })
      .eq(0)
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("link", {
      name: /View verification emails here/i,
    })
      .should("be.visible")
      .click({ force: true });

    cy.findAllByTestId(newUserAccount.email)
      .eq(0)
      .within(() => {
        cy.findByTestId("verification-token")
          .invoke("text")
          .then(($token) => {
            cy.findByRole("link", { name: /enter code here/i })
              .should("be.visible")
              .click({ force: true });
            cy.wait(1000);
            cy.focused().type($token);
          });
      });

    cy.findByRole("button", { name: /verify/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(
      /You have successfully joined ownerAccount-test's organization/i
    );
    cy.findByRole("link", { name: /logout/i })
      .should("be.visible")
      .click({ force: true });
  });

  it("Accept invitation -- Existing User", () => {
    cy.createAndVerifyAccount(existingUserAccount);
    cy.findByRole("link", { name: /logout/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("textbox", { name: /email/i })
      .should("be.visible")
      .type(ownerAccount.email);

    cy.findByLabelText(/password/i)
      .should("be.visible")
      .type(ownerAccount.password);

    cy.findByRole("button", { name: /log in/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("link", { name: /user accounts/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(500)
      .findByRole("button", { name: /add user/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/add user/i);

    cy.focused().type(existingUserAccount.email);

    cy.wait(200)
      .findByRole("button", { name: /send invite/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/invitation successfully sent/i);

    cy.wait(1000)
      .findByRole("link", { name: /logout/i })
      .should("be.visible")
      .click({ force: true });

    cy.visit("/fakeMail");

    cy.findByTestId(`${existingUserAccount.email}-link`)
      .contains(/join here/i)
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("textbox", { name: /email/i })
      .should("be.visible")
      .should("have.value", existingUserAccount.email)
      .should("have.attr", "readonly", "readonly");

    cy.wait(500)
      .findByLabelText(/password/i)
      .should("be.visible")
      .type(ownerAccount.password);

    cy.findByRole("button", { name: /log in/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(
      /You have successfully joined ownerAccount-test's organization/i
    );

    cy.findByRole("link", { name: /logout/i })
      .should("be.visible")
      .click({ force: true });
  });

  it("Confirm new users on owner org table & user deletion", () => {
    cy.visit("/login");

    cy.wait(500)
      .findByRole("textbox", { name: /email/i })
      .should("be.visible")
      .type(ownerAccount.email);

    cy.findByLabelText(/password/i)
      .should("be.visible")
      .type(ownerAccount.password);

    cy.findByRole("button", { name: /log in/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("link", { name: /user accounts/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/user accounts/i);

    cy.get("tbody").within(() => {
      // Two new users plus the owner
      cy.get("tr").should("have.length", 3);

      cy.get("input").eq(0).click({ force: true });
    });

    cy.findByRole("button", { name: /remove/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(500).findByText(/remove user/i);
    cy.findByText(/confirm removal/i);

    cy.findAllByRole("presentation")
      .eq(0)
      .within(() => {
        cy.findByRole("button", { name: /remove/i })
          .as("modalRemove")
          .should("be.disabled");
      });

    cy.focused().type("REMOVE");

    cy.wait(500)
      .get("@modalRemove")
      .should("be.enabled")
      .click({ force: true });

    cy.wait(500).findByText(/User deleted/i);

    cy.get("tbody").within(() => {
      cy.get("tr").should("have.length", 2);
    });
  });

  it("Works with Sorting, Filtering, and Pagination", () => {
    cy.seedOrganization(differentOwnerAccount.email, 15);
    cy.visit("/login");

    cy.wait(1000)
      .findByRole("textbox", { name: /email/i })
      .type(differentOwnerAccount.email);
    cy.findByLabelText(/password/i).type(differentOwnerAccount.password);

    cy.wait(1000)
      .findAllByRole("button", { name: /log in/i })
      .eq(0)
      .should("be.visible")
      .click({ force: true });

    cy.wait(2000)
      .findByRole("link", { name: /View verification emails here/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByTestId(differentOwnerAccount.email).within(() => {
      cy.findByTestId("verification-token")
        .invoke("text")
        .then(($token) => {
          cy.findByRole("link", { name: /enter code here/i })
            .should("be.visible")
            .click({ force: true });
          cy.wait(1000);
          cy.focused().type($token);
        });
    });
    cy.findByRole("button", { name: /verify/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000)
      .get("main")
      .within(() => {
        cy.findAllByText(/welcome/i).should("have.length.gte", 1);
      });

    cy.wait(1000)
      .findByText(/user accounts/i)
      .click({ force: true });

    // Sorting
    cy.wait(1000)
      .get("tbody")
      .within(() => {
        cy.get("tr")
          .eq(0)
          .within(() => {
            cy.get("td")
              .eq(1)
              .invoke("text")
              .as("firstTableEmail", { type: "static" });
          });
      });

    cy.findByText(/email/i).click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=email");

    cy.wait(1000)
      .get("tbody")
      .within(() => {
        cy.get("tr")
          .eq(0)
          .within(() => {
            cy.get("td")
              .eq(1)
              .invoke("text")
              .as("ascTableEmail", { type: "static" });
          });
      });
    cy.get("@ascTableEmail").should("not.equal", cy.get("@firstTableEmail"));

    cy.findByText(/email/i).click({ force: true });

    cy.wait(1000).location("search").should("include", "sort=-email");

    cy.wait(1000)
      .get("tbody")
      .within(() => {
        cy.get("tr")
          .eq(0)
          .within(() => {
            cy.get("td")
              .eq(1)
              .then(($data) => {
                cy.wrap($data)
                  .should("not.equal", cy.get("@firstTableEmail"))
                  .should("not.equal", "@ascTableEmail");
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

    // Filter
    cy.get("tbody").within(() => {
      cy.findAllByRole("rowheader").should("have.length.gt", 0);
    });

    cy.wait(1000)
      .get("main")
      .within(() => {
        // random string to yield no results
        cy.findByRole("textbox", { name: /search/i }).type(
          "asjdkfhdaskjlfhasdkjl",
          { force: true }
        );
      });

    const params = new URLSearchParams();
    params.append("filter", "contains(,asjdkfhdaskjlfhasdkjl)");
    // Confirm our filtering/searching is wiring up to the URL correctly
    cy.location("search").should("include", params.toString());

    cy.get("tbody").within(() => {
      // no table row data to display
      cy.findAllByRole("rowheader").should("have.length", 0);
    });
  });
});
