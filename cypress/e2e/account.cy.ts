import { faker } from "@faker-js/faker";

describe("Account", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  function createLoginData() {
    return {
      email: `${faker.internet.userName()}-test@bigbear.ai`,
      password: "MyReally$trongPassword1",
      resetPassword: "MyReally$trongPassword2",
    };
  }

  function createOnboardingData() {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.number("123-123-1234"),
      emailSecondary: faker.internet.email(),
      role: "Other",
      companyName: faker.company.name(),
      levelOfExperience: "3-5 years",
      teamSize: "51-100",
    };
  }

  it("Allows User to update account information", () => {
    const loginDetails = createLoginData();
    const onboardingForm = createOnboardingData();
    cy.createAndVerifyAccount(loginDetails);

    cy.wait(1000)
      .findByRole("link", { name: /^account/i })
      .should("be.visible")
      .click({ force: true });

    cy.findByText(/hello,/i);
    cy.findByText(/update your personal details here/i);

    cy.findByLabelText(/email address/i)
      .should("be.disabled")
      .should("have.value", loginDetails.email);
    cy.findByLabelText(/first name/i)
      .should("have.value", "")
      .type(onboardingForm.firstName);
    cy.findByLabelText(/last name/i)
      .should("have.value", "")
      .type(onboardingForm.lastName);
    cy.findByLabelText(/phone/i)
      .should("have.value", "")
      .type(onboardingForm.phone);
    cy.findByLabelText(/secondary email/i)
      .should("have.value", "")
      .type(onboardingForm.emailSecondary);

    cy.findAllByText(/save/i).eq(1).click();

    cy.wait(1000).findByText(
      `Hello ${onboardingForm.firstName} ${onboardingForm.lastName},`
    );

    cy.wait(1000)
      .findByLabelText(/company name/i)
      .should("have.value", "")
      .type(onboardingForm.companyName);

    cy.get("input[name='role']").should("have.value", "");
    cy.findByLabelText(/your role/i).click();
    cy.findAllByText(onboardingForm.role).click();

    cy.get("input[name='levelOfExperience']").should("have.value", "");
    cy.findByLabelText(/level of experience/i).click();
    cy.findAllByText(onboardingForm.levelOfExperience).click();

    cy.get("input[name='teamSize']").should("have.value", "");
    cy.findByLabelText(/size of team/i).click();
    cy.findAllByText(onboardingForm.teamSize).click();

    cy.findAllByText(/save/i).eq(2).click();

    cy.reload();

    cy.wait(1000);
    cy.findByLabelText(/first name/i).should(
      "have.value",
      onboardingForm.firstName
    );
    cy.findByLabelText(/last name/i).should(
      "have.value",
      onboardingForm.lastName
    );
    cy.findByLabelText(/phone/i).should("have.value", onboardingForm.phone);
    cy.findByLabelText(/secondary email/i).should(
      "have.value",
      onboardingForm.emailSecondary
    );

    cy.findByLabelText(/company name/i).should(
      "have.value",
      onboardingForm.companyName
    );
    cy.get("input[name='levelOfExperience']").should("have.value", "3_5");
    cy.get("input[name='teamSize']").should("have.value", "51_100");
    cy.get("input[name='role']").should(
      "have.value",
      onboardingForm.role.toLowerCase()
    );
  });
});
