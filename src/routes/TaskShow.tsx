import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Form from '@rjsf/core';
import { Button, Stack } from 'react-bootstrap';

import HttpService from '../services/HttpService';
import ErrorContext from '../contexts/ErrorContext';

export default function TaskShow() {
  const [task, setTask] = useState(null);
  const [userTasks, setUserTasks] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const setErrorMessage = (useContext as any)(ErrorContext)[1];

  useEffect(() => {
    HttpService.makeCallToBackend({
      path: `/tasks/${params.process_instance_id}/${params.task_id}`,
      successCallback: setTask,
    });
    HttpService.makeCallToBackend({
      path: `/process-instance/${params.process_instance_id}/tasks`,
      successCallback: setUserTasks,
    });
  }, [params]);

  const processSubmitResult = (result: any) => {
    setErrorMessage('');
    if (result.ok) {
      navigate(`/tasks`);
    } else if (result.process_instance_id) {
      navigate(`/tasks/${result.process_instance_id}/${result.id}`);
    } else {
      setErrorMessage(`Received unexpected error: ${result.message}`);
    }
  };

  const handleFormSubmit = (event: any) => {
    HttpService.makeCallToBackend({
      path: `/tasks/${params.process_instance_id}/${params.task_id}`,
      successCallback: processSubmitResult,
      httpMethod: 'PUT',
      postBody: event.formData,
    });
  };

  const buildTaskNavigation = () => {
    let userTasksElement;
    if (userTasks) {
      userTasksElement = (userTasks as any).map(function getUserTasksElement(
        userTask: any
      ) {
        const taskUrl = `/tasks/${params.process_instance_id}/${userTask.id}`;
        if (userTask.id === params.task_id) {
          return <span>{userTask.name}</span>;
        }
        if (userTask.state === 'COMPLETED') {
          return <Link to={taskUrl}>{userTask.name}</Link>;
        }
        if (userTask.state === 'FUTURE') {
          return <span style={{ color: 'red' }}>{userTask.name}</span>;
        }
        if (userTask.state === 'READY') {
          return <Link to={taskUrl}>{userTask.name} - Current</Link>;
        }
        return null;
      });
    }
    return (
      <Stack direction="horizontal" gap={3}>
        <Button href="/tasks">Go Back To List</Button>
        {userTasksElement}
      </Stack>
    );
  };

  if (task) {
    const taskToUse = task as any;

    let formUiSchema;
    if (taskToUse.form_ui_schema) {
      formUiSchema = JSON.parse(taskToUse.form_ui_schema);
    }

    let reactFragmentToHideSubmitButton = null;
    if (taskToUse.state !== 'READY') {
      formUiSchema = Object.assign(formUiSchema || {}, {
        'ui:readonly': true,
      });

      // It doesn't seem as if Form allows for removing the default submit button
      // so passing a blank fragment or children seem to do it though
      //
      // from: https://github.com/rjsf-team/react-jsonschema-form/issues/1602
      reactFragmentToHideSubmitButton = <div />;
    }

    return (
      <main>
        {buildTaskNavigation()}
        <h1>Task: {taskToUse.name}</h1>
        <h3>status: {taskToUse.state}</h3>
        <Form
          formData={taskToUse.data}
          onSubmit={handleFormSubmit}
          schema={JSON.parse(taskToUse.form_schema)}
          uiSchema={formUiSchema}
        >
          {reactFragmentToHideSubmitButton}
        </Form>
      </main>
    );
  }

  return null;
}
