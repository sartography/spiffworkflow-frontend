describe('process-groups', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can create a new group and navigate there', () => {
    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()

    const displayName = `Test Group 1 ${id}`;
    const groupId = `test-group-1-${id}`;
    cy.contains(groupId).should('not.exist');
    cy.contains('Add a process group').click();
    cy.get('input[name=display_name]').type(displayName);
    cy.get('input[name=display_name]').should('have.value', displayName);
    cy.get('input[name=id]').should('have.value', groupId);
    cy.contains('Submit').click();

    cy.url().should('include', `process-groups/${groupId}`);
    cy.contains(`Process Group: ${groupId}`);
    cy.contains('Home').click();
    cy.contains(groupId);

    cy.contains(groupId).click()
    cy.url().should('include', `process-groups/${groupId}`);
    cy.contains(`Process Group: ${groupId}`);
  })

  it('can paginate items', () => {
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
