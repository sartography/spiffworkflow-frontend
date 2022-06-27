// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-qa=${selector}]`, ...args);
});

Cypress.Commands.add('createGroup', (groupId, groupDisplayName) => {
  cy.contains(groupId).should('not.exist');
  cy.contains('Add a process group').click();
  cy.get('input[name=display_name]').type(groupDisplayName);
  cy.get('input[name=display_name]').should('have.value', groupDisplayName);
  cy.get('input[name=id]').should('have.value', groupId);
  cy.contains('Submit').click();

  cy.url().should('include', `process-groups/${groupId}`);
  cy.contains(`Process Group: ${groupId}`);
});

Cypress.Commands.add('createModel', (groupId, modelId, modelDisplayName) => {
  cy.contains(modelId).should('not.exist');

  cy.contains('Add a process model').click();
  cy.get('input[name=display_name]').type(modelDisplayName);
  cy.get('input[name=display_name]').should('have.value', modelDisplayName);
  cy.get('input[name=id]').should('have.value', modelId);
  cy.contains('Submit').click();

  cy.url().should('include', `process-models/${groupId}/${modelId}`);
  cy.contains(`Process Model: ${modelId}`);
});

Cypress.Commands.add('runPrimaryBpmnFile', (expectedText) => {
  cy.contains('Run').click();
  cy.contains(expectedText);
  cy.reload(true);
  cy.contains(expectedText).should('not.exist');
});

Cypress.Commands.add('basicPaginationTest', () => {
  cy.get('#pagination-page-dropdown')
    .type('typing_to_open_dropdown_box....FIXME')
    .find('.dropdown-item')
    .contains(/^2$/)
    .click();

  cy.contains(/^1-2 of \d+$/);
  cy.getBySel('pagination-previous-button-inactive');
  cy.getBySel('pagination-next-button').click();
  cy.contains(/^3-4 of \d+$/);
  cy.getBySel('pagination-previous-button').click();
  cy.contains(/^1-2 of \d+$/);
});
