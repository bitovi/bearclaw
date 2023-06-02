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

  after(() => {
    cy.cleanupAccount({ email: ownerAccount.email });
    cy.cleanupAccount({ email: newUserAccount.email });
    cy.cleanupAccount({ email: existingUserAccount.email });
  });

  it("Invite user", () => {
    cy.createAndVerifyAccount(ownerAccount);

    cy.findByRole("link", { name: /user management/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/organization users/i);

    cy.get("tbody > tr").should("have.length", 0);

    cy.findAllByRole("button", { name: /remove/i }).should("have.length", 0);
    cy.wait(500)
      .findByRole("button", { name: /new/i })
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

    cy.findByText(/sign up/i)
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

    cy.findByRole("button", { name: /create account/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByRole("link", {
      name: /View verification emails here/i,
    })
      .should("be.visible")
      .click({ force: true });

    cy.findAllByTestId(newUserAccount.email)
      .eq(0)
      .findByRole("link", { name: /verify your email/i })
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

    cy.findByRole("link", { name: /user management/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(500)
      .findByRole("button", { name: /new/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/add user/i);

    cy.focused().type(existingUserAccount.email);

    cy.findByRole("button", { name: /send invite/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/invitation successfully sent/i);

    cy.findByRole("link", { name: /logout/i })
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

    cy.findByRole("link", { name: /user management/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/organization users/i);

    cy.get("tbody").within(() => {
      cy.get("tr")
        .should("have.length", 2)
        .eq(0)
        .should("be.visible")
        .click({ force: true });
    });

    cy.findByRole("button", { name: /remove/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/User deleted/i);

    cy.get("tbody").within(() => {
      cy.get("tr").should("have.length", 1);
    });
  });
});
