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

  it("should display passing test count", () => {
    cy.wait(2000);
    cy.getByText("test-all-good.spec.js").click({ force: true });
    cy.getByText("Run").click();
    cy.wait(5000);
    cy.queryByText("6 Passing tests").should("exist");
  });

  it("should display failure tests", () => {
    cy.wait(2000);
    cy.getByText("test-few-failure.spec.js").click({ force: true });
    cy.wait(2000);
    cy.getByText("Run").click();
    cy.wait(5000);
    cy.queryByText("5 Passing tests").should("exist");
  });

  it("should show update snapshot button", () => {
    cy.wait(2000);
    cy.getByText("test-snapshot-failure.spec.js").click({ force: true });
    cy.wait(2000);
    cy.getByText("Run").click();
    cy.wait(5000);
    cy.queryByText("Update Snapshot").should("exist");
  });

  it("should not show update snapshot button", () => {
    cy.wait(2000);
    cy.getByText("test-snapshot-text.spec.js").click({ force: true });
    cy.wait(2000);
    cy.getByText("Run").click();
    cy.wait(5000);
    cy.queryByText("Update Snapshot").should("not.exist");
  });
});
