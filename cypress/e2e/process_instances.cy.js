describe('process-instances', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can create a new instance and can modify', () => {
    const originalDmnOutputForKevin = "Very wonderful";
    const newDmnOutputForKevin = "The new wonderful";
    const dmnOutputForDan = "pretty wonderful";

    const originalPythonScript = 'person = "Kevin"';
    const newPythonScript = 'person = "Dan"';

    const dmnFile = "awesome_decision.dmn";
    const bpmnFile = "process_model_one.bpmn";

    cy.contains('acceptance-tests-group-one').click();
    cy.contains('acceptance-tests-model-1').click();

    cy.contains(originalDmnOutputForKevin).should('not.exist');;
    cy.contains('Run Primary').click();
    cy.contains(originalDmnOutputForKevin);

    // Change dmn
    cy.contains(dmnFile).click();
    cy.contains(`Process Model File: ${dmnFile}`);
    updateDmnText(originalDmnOutputForKevin, newDmnOutputForKevin);

    cy.contains('acceptance-tests-model-1').click();
    cy.contains('Run Primary').click();
    cy.contains(newDmnOutputForKevin);

    cy.contains(dmnFile).click();
    cy.contains(`Process Model File: ${dmnFile}`);
    updateDmnText(newDmnOutputForKevin, originalDmnOutputForKevin);
    cy.contains('acceptance-tests-model-1').click();
    cy.contains('Run Primary').click();
    cy.contains(originalDmnOutputForKevin);

    // Change bpmn
    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScript(newPythonScript, bpmnFile);
    cy.contains('acceptance-tests-model-1').click();
    cy.contains('Run Primary').click();
    cy.contains(dmnOutputForDan);

    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScript(originalPythonScript, bpmnFile);
    cy.contains('acceptance-tests-model-1').click();
    cy.contains('Run Primary').click();
    cy.contains(originalDmnOutputForKevin);
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

function updateDmnText(oldText, newText, elementId="wonderful_process", dmnFile="awesome_decision.dmn") {
  // this will break if there are more elements added to the drd
  cy.get(`g[data-element-id=${elementId}]`).click().should('exist');
  cy.get('.dmn-icon-decision-table').click();
  cy.contains(oldText).clear().type(`"${newText}"`);

  // wait for a little bit for the xml to get set before saving
  cy.wait(500);
  cy.contains('Save').click();

}

function updateBpmnPythonScript(pythonScript, bpmnFile, elementId="process_script") {
  cy.get(`g[data-element-id=${elementId}]`).click().should('exist');
  cy.contains('SpiffWorkflow Properties').click();
  cy.get('#bio-properties-panel-pythonScript').clear().type(pythonScript);

  // wait for a little bit for the xml to get set before saving
  cy.wait(500);
  cy.contains('Save').click();
}
