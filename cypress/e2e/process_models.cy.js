describe('process-models', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can create a new model and navigate there', () => {
    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const groupDisplayName = `Test Group 2 ${id}`;
    const groupId = `test-group-2-${id}`;
    const modelDisplayName = `Test Model 2 ${id}`;
    const modelId = `test-model-2-${id}`;
    cy.createModel(groupId, groupDisplayName, modelId, modelDisplayName);
    cy.contains(`Process Group: ${groupId}`).click();
    cy.contains(modelId);

    cy.contains(modelId).click()
    cy.url().should('include', `process-models/${groupId}/${modelId}`);
    cy.contains(`Process Model: ${modelId}`);

    cy.contains('Delete Process Model').click();
    cy.url().should('include', `process-groups/${groupId}`);
    cy.contains(modelId).should('not.exist');
  });

  // it('can paginate items', () => {
  //   cy.contains('acceptance-tests-group-one').click();
  //   cy.get("#pagination-page-dropdown")
  //     .type("typing_to_open_dropdown_box....FIXME")
  //     .find('.dropdown-item')
  //     .contains(/^2$/)
  //     .click();
  //
  //   cy.contains(/^1-2 of \d+$/);
  //   cy.getBySel("pagination-next-button").click();
  //   cy.contains(/^3-4 of \d+$/);
  //   cy.getBySel("pagination-previous-button").click();
  //   cy.contains(/^1-2 of \d+$/);
  // })
})

