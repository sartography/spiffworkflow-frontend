import { format } from 'date-fns';
import { DATE_FORMAT, PROCESS_STATUSES } from '../../src/config';

const filterByDate = (fromDate) => {
  cy.get('#date-picker-start-from').clear().type(format(fromDate, DATE_FORMAT));
  cy.contains('Start Range').click();
  cy.get('#date-picker-end-from').clear().type(format(fromDate, DATE_FORMAT));
  cy.contains('Start Range').click();
  cy.contains('Filter').click();
};

const assertAtLeastOneItemInPaginatedResults = () => {
  cy.getBySel('total-paginated-items')
    .invoke('text')
    .then(parseFloat)
    .should('be.gt', 0);
};

const assertNoItemInPaginatedResults = () => {
  cy.getBySel('total-paginated-items').contains('0');
};

const updateDmnText = (oldText, newText, elementId = 'wonderful_process') => {
  // this will break if there are more elements added to the drd
  cy.get(`g[data-element-id=${elementId}]`).click().should('exist');
  cy.get('.dmn-icon-decision-table').click();
  cy.contains(oldText).clear().type(`"${newText}"`);

  // wait for a little bit for the xml to get set before saving
  // FIXME: gray out save button or add spinner while xml is loading
  cy.wait(500);
  cy.contains('Save').click();
};

const updateBpmnPythonScript = (pythonScript, elementId = 'process_script') => {
  cy.get(`g[data-element-id=${elementId}]`).click().should('exist');
  cy.contains(/^Script$/).click();
  cy.get('textarea[name="pythonScript_bpmn:script"]')
    .clear()
    .type(pythonScript);

  // wait for a little bit for the xml to get set before saving
  cy.wait(500);
  cy.contains('Save').click();
};

const updateBpmnPythonScriptWithMonaco = (
  pythonScript,
  elementId = 'process_script'
) => {
  cy.get(`g[data-element-id=${elementId}]`).click().should('exist');
  cy.contains(/^Script$/).click();
  cy.contains('Launch Editor').click();
  cy.contains('Loading...').should('not.exist');
  cy.get('.monaco-editor textarea:first')
    .click()
    .focused() // change subject to currently focused element
    .type('{ctrl}a')
    .type(pythonScript);

  cy.contains('Close').click();
  // wait for a little bit for the xml to get set before saving
  cy.wait(500);
  cy.contains('Save').click();
};

describe('process-instances', () => {
  beforeEach(() => {
    cy.signInToAdmin();
    cy.contains('acceptance-tests-group-one').click();
    cy.contains('Process Group: acceptance-tests-group-one');
    // https://stackoverflow.com/q/51254946/6090676
    cy.getBySel('process-model-show-link')
      .contains('acceptance-tests-model-1')
      .click();
  });

  it('can create a new instance and can modify', () => {
    const originalDmnOutputForKevin = 'Very wonderful';
    const newDmnOutputForKevin = 'The new wonderful';
    const dmnOutputForDan = 'pretty wonderful';

    const originalPythonScript = 'person = "Kevin"';
    const newPythonScript = 'person = "Dan"';

    const dmnFile = 'awesome_decision.dmn';
    const bpmnFile = 'process_model_one.bpmn';

    cy.contains(originalDmnOutputForKevin).should('not.exist');
    cy.runPrimaryBpmnFile(originalDmnOutputForKevin);

    // Change dmn
    cy.contains(dmnFile).click();
    cy.contains(`Process Model File: ${dmnFile}`);
    updateDmnText(originalDmnOutputForKevin, newDmnOutputForKevin);

    cy.contains('acceptance-tests-model-1').click();
    cy.runPrimaryBpmnFile(newDmnOutputForKevin);

    cy.contains(dmnFile).click();
    cy.contains(`Process Model File: ${dmnFile}`);
    updateDmnText(newDmnOutputForKevin, originalDmnOutputForKevin);
    cy.contains('acceptance-tests-model-1').click();
    cy.runPrimaryBpmnFile(originalDmnOutputForKevin);

    // Change bpmn
    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScript(newPythonScript);
    cy.contains('acceptance-tests-model-1').click();
    cy.runPrimaryBpmnFile(dmnOutputForDan);

    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScript(originalPythonScript);
    cy.contains('acceptance-tests-model-1').click();
    cy.runPrimaryBpmnFile(originalDmnOutputForKevin);
  });

  it('can create a new instance and can modify with monaco text editor', () => {
    const dmnOutputForKevin = 'Very wonderful';
    const dmnOutputForMike = 'Powerful wonderful';
    const originalPythonScript = 'person = "Kevin"';
    const newPythonScript = 'person = "Mike"';
    const bpmnFile = 'process_model_one.bpmn';

    // Change bpmn
    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScriptWithMonaco(newPythonScript);
    cy.contains('acceptance-tests-model-1').click();
    cy.runPrimaryBpmnFile(dmnOutputForMike);

    cy.contains(bpmnFile).click();
    cy.contains(`Process Model File: ${bpmnFile}`);
    updateBpmnPythonScriptWithMonaco(originalPythonScript);
    cy.contains('acceptance-tests-model-1').click();
    cy.runPrimaryBpmnFile(dmnOutputForKevin);
  });

  it('can paginate items', () => {
    // make sure we have some process instances
    cy.runPrimaryBpmnFile('Very wonderful');
    cy.runPrimaryBpmnFile('Very wonderful');
    cy.runPrimaryBpmnFile('Very wonderful');
    cy.runPrimaryBpmnFile('Very wonderful');
    cy.runPrimaryBpmnFile('Very wonderful');

    cy.getBySel('process-instance-list-link').click();
    cy.basicPaginationTest();
  });

  it('can filter', () => {
    cy.getBySel('process-instance-list-link').click();
    assertAtLeastOneItemInPaginatedResults();

    PROCESS_STATUSES.forEach((processStatus) => {
      if (processStatus !== 'all') {
        cy.getBySel('process-status-dropdown')
          .type('typing_to_open_dropdown_box....FIXME')
          .find('.dropdown-item')
          .contains(new RegExp(`^${processStatus}$`))
          .click();
        cy.contains('Filter').click();
        assertAtLeastOneItemInPaginatedResults();
        cy.getBySel(`process-instance-status-${processStatus}`).contains(
          processStatus
        );
      }
    });
    cy.getBySel('process-status-dropdown')
      .type('typing_to_open_dropdown_box....FIXME')
      .find('.dropdown-item')
      .contains('all')
      .click();

    const date = new Date();
    date.setHours(date.getHours() - 1);
    filterByDate(date);
    assertAtLeastOneItemInPaginatedResults();

    date.setHours(date.getHours() + 2);
    filterByDate(date);
    assertNoItemInPaginatedResults();
  });
});
