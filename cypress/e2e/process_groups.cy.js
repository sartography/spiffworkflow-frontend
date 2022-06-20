describe('process-groups', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can perform crud operations', () => {
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

    cy.contains('Delete Process Group').click();
    cy.url().should('include', `process-groups`);
    cy.contains(groupId).should('not.exist');
  })

  it('can paginate items', () => {
    cy.basicPaginationTest();
  })
})
