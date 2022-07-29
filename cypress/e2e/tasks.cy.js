const submitInputIntoFormField = (formName, fieldKey, fieldValue) => {
  cy.contains(`Task: ${formName}`);
  cy.get(fieldKey).clear().type(fieldValue);
  cy.contains('Submit').click();
};

const checkFormFieldIsReadOnly = (formName, fieldKey) => {
  cy.contains(`Task: ${formName}`);
  cy.get(fieldKey).invoke('attr', 'readonly').should('exist');
};

const checkTaskHasClass = (taskName, className) => {
  cy.get(`g[data-element-id=${taskName}]`).should('have.class', className);
};

describe('process-models', () => {
  beforeEach(() => {
    cy.signInToAdmin();
  });

  it('can complete and navigate a form', () => {
    const groupId = 'acceptance-tests-group-one';
    const modelId = `acceptance-tests-model-2`;
    const completedTaskClassName = 'completed-task-highlight';
    const activeTaskClassName = 'active-task-highlight';

    cy.navigateToProcessModel(groupId, modelId);

    // create a bunch to test pagination as well
    cy.runPrimaryBpmnFile('validate_only');
    cy.navigateToTasks();
    cy.url().should('include', '/tasks');

    // FIXME: this will probably need a better way to link to the proper form that we want
    cy.contains('Complete form1').click();
    submitInputIntoFormField('form1', '#root_user_generated_number_1', 2);
    submitInputIntoFormField('form2', '#root_user_generated_number_2', 3);

    cy.contains('Task: form3');
    cy.getBySel('form-nav-form2').click();
    checkFormFieldIsReadOnly('form2', '#root_user_generated_number_2');
    cy.getBySel('form-nav-form1').click();
    checkFormFieldIsReadOnly('form1', '#root_user_generated_number_1');

    cy.getBySel('form-nav-form3').should('have.text', 'form3 - Current');
    cy.getBySel('form-nav-form3').click();
    submitInputIntoFormField('form3', '#root_user_generated_number_3', 4);

    cy.contains('Task: form4');
    cy.navigateToProcessModel(groupId, modelId);
    cy.getBySel('process-instance-list-link').click();
    cy.assertAtLeastOneItemInPaginatedResults();

    // This should get the first one which should be the one we just completed
    cy.getBySel('process-instance-show-link').first().click();
    cy.contains('Process Instance Id: ');
    cy.contains('"user_generated_number_1": 2');
    cy.contains('"user_generated_number_2": 3');
    cy.contains('"user_generated_number_3": 4');
    cy.contains('"user_generated_number_4": 5').should('not.exist');
    checkTaskHasClass('form1', completedTaskClassName);
    checkTaskHasClass('form2', completedTaskClassName);
    checkTaskHasClass('form3', completedTaskClassName);
    checkTaskHasClass('form4', activeTaskClassName);

    cy.navigateToTasks();
    cy.url().should('include', '/tasks');

    // FIXME: this will probably need a better way to link to the proper form that we want
    cy.contains('Complete form4').click();
    submitInputIntoFormField('form4', '#root_user_generated_number_4', 5);
    cy.url().should('include', '/tasks');

    cy.navigateToProcessModel(groupId, modelId);
    cy.getBySel('process-instance-list-link').click();
    cy.assertAtLeastOneItemInPaginatedResults();

    // This should get the first one which should be the one we just completed
    cy.getBySel('process-instance-show-link').first().click();
    cy.contains('Process Instance Id: ');
    cy.contains('"user_generated_number_1": 2');
    cy.contains('"user_generated_number_2": 3');
    cy.contains('"user_generated_number_3": 4');
    cy.contains('"user_generated_number_4": 5');
    checkTaskHasClass('form1', completedTaskClassName);
    checkTaskHasClass('form2', completedTaskClassName);
    checkTaskHasClass('form3', completedTaskClassName);
    checkTaskHasClass('form4', completedTaskClassName);
  });

  it('can paginate items', () => {
    cy.navigateToProcessModel(
      'acceptance-tests-group-one',
      'acceptance-tests-model-2'
    );

    // make sure we have some tasks
    cy.runPrimaryBpmnFile('validate_only');
    cy.runPrimaryBpmnFile('validate_only');
    cy.runPrimaryBpmnFile('validate_only');
    cy.runPrimaryBpmnFile('validate_only');
    cy.runPrimaryBpmnFile('validate_only');

    cy.navigateToTasks();
    cy.basicPaginationTest();
  });
});
