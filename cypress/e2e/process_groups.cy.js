describe('process-groups', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can create a new group and navigate there', () => {
    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const groupDisplayName = `Test Group 1 ${id}`;
    const groupId = `test-group-1-${id}`;
    cy.createGroup(groupId, groupDisplayName);

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
