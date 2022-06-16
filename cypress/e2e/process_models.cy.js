describe('process-groups', () => {
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
    cy.createGroup(groupDisplayName, groupId);
    cy.contains(modelId).should('not.exist');

    cy.contains('Add a process model').click();
    cy.get('input[name=display_name]').type(modelDisplayName);
    cy.get('input[name=display_name]').should('have.value', modelDisplayName);
    cy.get('input[name=id]').should('have.value', modelId);
    cy.contains('Submit').click();

    cy.url().should('include', `process-models/${groupId}/${modelId}`);
    cy.contains(`Process Model: ${modelId}`);
    cy.contains(`Process Group: ${groupId}`).click();
    cy.contains(modelId);

    cy.contains(modelId).click()
    cy.url().should('include', `process-models/${groupId}/${modelId}`);
    cy.contains(`Process Model: ${modelId}`);
  });

  it('can paginate items', () => {
    cy.contains('acceptance-tests-group-one').click();
    cy.get("#pagination-page-dropdown")
      .type("typing_to_open_dropdown_box....FIXME")
      .find('.dropdown-item')
      .contains(/^2$/)
      .click();

    cy.contains(/^1-2 of \d+$/);
    cy.getBySel("pagination-next-button").click();
    cy.contains(/^3-4 of \d+$/);
    cy.getBySel("pagination-previous-button").click();
    cy.contains(/^1-2 of \d+$/);
  })
})

