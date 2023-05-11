import { faker } from "@faker-js/faker";

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test on uncaught exceptions
  // Our server throws for certain errors like invalid password, but it should not fail the test
  return false;
});

type LoginData = {
  email: string;
  password: string;
  resetPassword: string;
};

function createLoginData(): LoginData {
  return {
    email: `${faker.internet.userName()}-test@bigbear.ai`,
    password: faker.internet.password(),
    resetPassword: faker.internet.password(),
  };
}

function createOnboardingData() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.number(),
    emailSecondary: faker.internet.email(),
    role: 'Other',
    companyName: faker.company.name(),
    levelOfExperience: '3-5 years',
    teamSize: '51-100'
  }
}

function createAndVerifyAccount({ email, password }: LoginData) {
  cy.findByRole("textbox", { name: /email/i }).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole("button", { name: /create account/i }).click();
  cy.findByRole("link", { name: /View verification emails here/i }).click();
  cy.findByTestId(email)
    .findByRole("link", { name: /verify your email/i })
    .click();
  cy.findByText(/verified successfully/i);
}

describe("join and authenticate tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to onboard", () => {
    const loginForm = createLoginData();

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.viewport(1280, 800);
    cy.visitAndCheck("/home");

    // Sign up
    cy.findByRole("link", { name: /sign up/i }).click();
    createAndVerifyAccount(loginForm);

    // Onboarding time
    const onboardingForm = createOnboardingData();
    cy.visitAndCheck("/onboarding");

    cy.findByLabelText(/first name/i).type(onboardingForm.firstName);
    cy.findByLabelText(/last name/i).type(onboardingForm.lastName);
    cy.findByLabelText(/phone/i).type(onboardingForm.phone);
    cy.findByLabelText(/secondary email/i).type(onboardingForm.emailSecondary);
    cy.findByRole("button", { name: /next/i }).click();
    cy.findByLabelText(/your role/i)
    cy.findByRole("button", { name: /previous/i }).click();
    cy.findByLabelText(/first name/i)
    cy.findByRole("button", { name: /next/i }).click();
    cy.findByLabelText(/company name/i).type(onboardingForm.companyName);
    cy.findByLabelText(/your role/i).click()
    cy.findAllByText(onboardingForm.role).click();
    cy.findByLabelText(/level of experience/i).click();
    cy.findAllByText(onboardingForm.levelOfExperience).click();
    cy.findByLabelText(/size of team/i).click();
    cy.findAllByText(onboardingForm.teamSize).click();
    cy.findByRole("button", { name: /submit/i }).click();

    cy.findByText(onboardingForm.firstName + " " + onboardingForm.lastName);
  })
})