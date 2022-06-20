describe('process-models', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can perform crud operations', () => {
    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const groupId = 'acceptance-tests-group-one';
    const modelDisplayName = `Test Model 2 ${id}`;
    const modelId = `test-model-2-${id}`;
    cy.contains(groupId).click();
    cy.createModel(groupId, modelId, modelDisplayName);
    cy.contains(`Process Group: ${groupId}`).click();
    cy.contains(modelId);

    cy.contains(modelId).click()
    cy.url().should('include', `process-models/${groupId}/${modelId}`);
    cy.contains(`Process Model: ${modelId}`);

    cy.contains('Delete process model').click();
    cy.url().should('include', `process-groups/${groupId}`);
    cy.contains(modelId).should('not.exist');
  });

  it('can create new bpmn and dmn files', () => {
    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const groupId = 'acceptance-tests-group-one';
    const modelDisplayName = `Test Model 2 ${id}`;
    const modelId = `test-model-2-${id}`;
    const bpmnFileName = `bpmn_test_file_${id}`;
    const dmnFileName = `dmn_test_file_${id}`;

    cy.contains(groupId).click();
    cy.createModel(groupId, modelId, modelDisplayName);
    cy.contains(`Process Group: ${groupId}`).click();
    cy.contains(modelId);

    cy.contains(modelId).click()
    cy.url().should('include', `process-models/${groupId}/${modelId}`);
    cy.contains(`Process Model: ${modelId}`);
    cy.contains(bpmnFileName + '.bpmn').should('not.exist');
    cy.contains(dmnFileName + '.dmn').should('not.exist');

    // add new bpmn file
    cy.contains('Add New BPMN File').click();
    cy.contains(/^Process Model File$/);
    cy.get('g[data-element-id=StartEvent_1]').click().should('exist');
    cy.contains('General').click();
    cy.get('#bio-properties-panel-name').clear().type("Start Event Name");
    cy.wait(500);
    cy.contains('Save').click();
    cy.contains('Start Event Name');
    cy.get('input[name=file_name]').type(bpmnFileName);
    cy.contains('Save Changes').click();
    cy.contains(`Process Model File: ${bpmnFileName}`);
    cy.contains(modelId).click();
    cy.contains(`Process Model: ${modelId}`);
    cy.contains(bpmnFileName + '.bpmn').should('exist');

    // add new dmn file
    cy.contains('Add New DMN File').click();
    cy.contains(/^Process Model File$/);
    cy.get('g[data-element-id=decision_1]').click().should('exist');
    cy.contains('General').click();
    cy.contains('Save').click();
    cy.get('input[name=file_name]').type(dmnFileName);
    cy.contains('Save Changes').click();
    cy.contains(`Process Model File: ${dmnFileName}`);
    cy.contains(modelId).click();
    cy.contains(`Process Model: ${modelId}`);
    cy.contains(dmnFileName + '.dmn').should('exist');

    cy.contains('Delete process model').click();
    cy.url().should('include', `process-groups/${groupId}`);
    cy.contains(modelId).should('not.exist');
  });

  it('can paginate items', () => {
    cy.contains('acceptance-tests-group-one').click();
    cy.basicPaginationTest();
  })
})

