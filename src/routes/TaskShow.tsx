import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '@rjsf/core';
import { Button, Stack } from 'react-bootstrap';

import HttpService from '../services/HttpService';

export default function TaskShow() {
  const [activeTask, setActiveTask] = useState(null);
  const [task, setTask] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    HttpService.makeCallToBackend({
      path: `/tasks/${params.process_instance_id}/${params.task_id}`,
      successCallback: setActiveTask,
    });
  }, [params]);

  const processSubmitResult = (result: any) => {
    if (result.ok) {
      navigate(`/tasks`);
    } else {
      navigate(`/tasks/${result.process_instance_id}/${result.id}`);
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

  const gotToOtherTask = (
    taskId: any,
    processInstanceId: any,
    taskType: string = 'previous'
  ) => {
    if (taskId) {
      let text = '<< Previous Form';
      let path = `/tasks/${taskId}/${processInstanceId}`;
      if (taskType === 'following') {
        text = 'Next Form >>';
      } else if (taskType === 'current') {
        text = 'Current Active Task';
        path = `/tasks/${taskId}`;
      }

      return (
        <Button variant="secondary" href={path}>
          {text}
        </Button>
      );
    }
    return <main />;
  };

  if (activeTask) {
    const activeTaskToUse = activeTask as any;

    let formUiSchema;
    if (activeTaskToUse.form_ui_schema) {
      formUiSchema = JSON.parse(activeTaskToUse.form_ui_schema);
    }

    return (
      <main>
        <Stack direction="horizontal" gap={3}>
          <Button href="/tasks">Go Back To List</Button>
          {gotToOtherTask(
            activeTaskToUse.preceding_spiffworkflow_user_task_id,
            activeTaskToUse.process_instance_id
          )}
        </Stack>
        <h1>Task ID: {activeTaskToUse.id}</h1>
        <h3>process_instance_id: {activeTaskToUse.process_instance_id}</h3>
        <h3>status: {activeTaskToUse.state}</h3>
        <Form
          formData={activeTaskToUse.data}
          onSubmit={handleFormSubmit}
          schema={JSON.parse(activeTaskToUse.form_schema)}
          uiSchema={formUiSchema}
        />
      </main>
    );
  }

  // <Stack direction="horizontal" gap={3}>
  //   <Button href="/tasks">Go Back To List</Button>
  //   {gotToOtherTask(
  //     taskToUse.preceding_spiffworkflow_user_task_id,
  //     params.process_instance_id
  //   )}
  //   {gotToOtherTask(
  //     taskToUse.following_spiffworkflow_user_task_id,
  //     params.process_instance_id,
  //     'following'
  //   )}
  //   {gotToOtherTask(
  //     taskToUse.current_active_task_id,
  //     params.process_instance_id,
  //     'current'
  //   )}
  // </Stack>
  if (task) {
    const taskToUse = task as any;
    const uiSchema = Object.assign(taskToUse.form_ui_schema || {}, {
      'ui:readonly': true,
    });
    return (
      <main>
        <h3>process_instance_id: {params.process_instance_id}</h3>
        <h3>status: {taskToUse.state}</h3>
        <Form
          formData={taskToUse.data}
          schema={JSON.parse(taskToUse.form_schema)}
          uiSchema={uiSchema}
        >
          <div />
        </Form>
      </main>
    );
  }

  return null;
}
