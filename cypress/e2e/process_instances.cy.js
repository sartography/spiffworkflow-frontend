describe('process-instances', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('acceptance-tests-group-one').click();
    cy.contains('acceptance-tests-model-1').click();
  });

  it('can create a new instance and can modify', () => {
    const originalDmnOutputForKevin = "Very wonderful";
    const newDmnOutputForKevin = "The new wonderful";
    const dmnOutputForDan = "pretty wonderful";

    const originalPythonScript = 'person = "Kevin"';
    const newPythonScript = 'person = "Dan"';

    const dmnFile = "awesome_decision.dmn";
    const bpmnFile = "process_model_one.bpmn";

    cy.contains(originalDmnOutputForKevin).should('not.exist');;
    runPrimaryBpmnFile(originalDmnOutputForKevin);

    // Change dmn
    cy.contains(dmnFile).click();
    cy.contains(`Process Model File: ${dmnFile}`);
    updateDmnText(originalDmnOutputForKevin, newDmnOutputForKevin);

    cy.contains('acceptance-tests-model-1').click();
    runPrimaryBpmnFile(newDmnOutputForKevin);

    cy.contains(dmnFile).click();
    cy.contains(`Process Model File: ${dmnFile}`);
    updateDmnText(newDmnOutputForKevin, originalDmnOutputForKevin);
    cy.contains('acceptance-tests-model-1').click();
    runPrimaryBpmnFile(originalDmnOutputForKevin);

    // Change bpmn
    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScript(newPythonScript, bpmnFile);
    cy.contains('acceptance-tests-model-1').click();
    runPrimaryBpmnFile(dmnOutputForDan);

    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScript(originalPythonScript, bpmnFile);
    cy.contains('acceptance-tests-model-1').click();
    runPrimaryBpmnFile(originalDmnOutputForKevin);
  });

  it('can create a new instance and can modify with monaco text editor', () => {
    const dmnOutputForKevin = "Very wonderful";
    const dmnOutputForMike = "Powerful wonderful";
    const originalPythonScript = 'person = "Kevin"';
    const newPythonScript = 'person = "Mike"';
    const bpmnFile = "process_model_one.bpmn";

    // Change bpmn
    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScriptWithMonaco(newPythonScript, bpmnFile);
    cy.contains('acceptance-tests-model-1').click();
    runPrimaryBpmnFile(dmnOutputForMike);

    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScriptWithMonaco(originalPythonScript, bpmnFile);
    cy.contains('acceptance-tests-model-1').click();
    runPrimaryBpmnFile(dmnOutputForKevin);
  });

  it('can paginate items', () => {
    // make sure we have some process instances
    runPrimaryBpmnFile('Very wonderful');
    runPrimaryBpmnFile('Very wonderful');
    runPrimaryBpmnFile('Very wonderful');
    runPrimaryBpmnFile('Very wonderful');
    runPrimaryBpmnFile('Very wonderful');

    cy.contains('Process Instances').click();
    cy.basicPaginationTest();
  })
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

function updateBpmnPythonScriptWithMonaco(pythonScript, bpmnFile, elementId="process_script") {
  cy.get(`g[data-element-id=${elementId}]`).click().should('exist');
  cy.contains('SpiffWorkflow Properties').click();
  cy.contains('Launch Editor').click();
  cy.contains("Loading...").should('not.exist');
  cy.get('.monaco-editor textarea:first')
    .click()
    .focused() // change subject to currently focused element
    .type('{ctrl}a')
    .type(pythonScript)

  cy.contains('Close').click();
  // wait for a little bit for the xml to get set before saving
  cy.wait(500);
  cy.contains('Save').click();
}

function runPrimaryBpmnFile(expectedText) {
  cy.contains('Run Primary').click();
  cy.contains(expectedText);
}
