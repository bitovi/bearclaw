import { faker } from "@faker-js/faker";

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test on uncaught exceptions
  // Our server throws for certain errors like invalid password, but it should not fail the test
  return false;
});

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

describe("join and authenticate tests", () => {
  afterEach(() => {
    cy.cleanupAccount();
  });

  it("should allow you to onboard", () => {
    cy.createAndVerifyAccount();
    cy.visitAndCheck("/onboarding");

    // Onboarding time
    const onboardingForm = createOnboardingData();

    cy.findByLabelText(/first name/i).type(onboardingForm.firstName);
    cy.findByLabelText(/last name/i).type(onboardingForm.lastName);
    cy.findByLabelText(/phone/i).type(onboardingForm.phone);
    cy.findByLabelText(/secondary email/i).type(onboardingForm.emailSecondary);
    cy.findByRole("button", { name: /continue/i }).click();
    cy.findByLabelText(/your role/i);
    cy.findByRole("button", { name: /previous/i }).click();
    cy.findByLabelText(/first name/i);
    cy.findByRole("button", { name: /continue/i }).click();
    cy.findByLabelText(/company name/i).type(onboardingForm.companyName);
    cy.findByLabelText(/your role/i).click();
    cy.findAllByText(onboardingForm.role).click();
    cy.findByLabelText(/level of experience/i).click();
    cy.findAllByText(onboardingForm.levelOfExperience).click();
    cy.findByLabelText(/size of team/i).click();
    cy.findAllByText(onboardingForm.teamSize).click();
    cy.wait(1000)
      .findByRole("button", { name: /finish profile/i })
      .click({ force: true });

    cy.wait(1000)
      .get("main")
      .within(() => {
        cy.findByText(/dashboard/i);
      });

    cy.findByRole("link", { name: /account/i })
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000)
      .findAllByText((text) => {
        return text.includes(
          onboardingForm.firstName + " " + onboardingForm.lastName
        );
      })
      .should("have.length.gte", 1);
  });
});
