/// <reference types="Cypress" />

context("basic", () => {
  beforeEach(() => {
    cy.visit("http://localhost:9000", {
      timeout: 9000
    });
  });

  after(() => {
    cy.exec("yarn kill-app");
  });

  it("should display files", () => {
    cy.wait(2000);
    cy.getByText("test-all-good.spec.js").click();
    cy.getByText("Run").click();
    cy.wait(5000);
  });

  it("should display failure", () => {
    cy.wait(2000);
    cy.getByText("test-few-failure.spec.js").click();
    cy.wait(2000);
    cy.getByText("Run").click();
    cy.wait(5000);
    cy.queryByText("5 Passing tests").should("exist");
  });
});
