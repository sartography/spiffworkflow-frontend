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
    if ((params as any).task_id.match(/^\w{8}-(\w{4}-){3}\w{12}/)) {
      HttpService.makeCallToBackend({
        path: `/tasks/completed_user_task/${params.process_instance_id}/${params.task_id}`,
        successCallback: setTask,
      });
    } else {
      const taskId = parseInt(params.task_id || '', 10);
      HttpService.makeCallToBackend({
        path: `/tasks/${taskId}`,
        successCallback: setActiveTask,
      });
    }
  }, [params]);

  const processResult = (result: any) => {
    if (result.ok) {
      navigate(`/tasks`);
    } else {
      navigate(`/tasks/${result.id}`);
    }
  };

  const handleFormSubmit = (event: any) => {
    HttpService.makeCallToBackend({
      path: `/tasks/${(activeTask as any).id}/submit`,
      successCallback: processResult,
      httpMethod: 'POST',
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
    const taskToUse = activeTask as any;
    return (
      <main>
        <Stack direction="horizontal" gap={3}>
          <Button href="/tasks">Go Back To List</Button>
          {gotToOtherTask(
            taskToUse.preceding_spiffworkflow_user_task_id,
            taskToUse.process_instance_id
          )}
        </Stack>
        <h1>Task ID: {(activeTask as any).id}</h1>
        <h3>process_instance_id: {(activeTask as any).process_instance_id}</h3>
        <h3>status: {(activeTask as any).status}</h3>
        <Form
          formData={JSON.parse((activeTask as any).spiffworkflow_task_data)}
          onSubmit={handleFormSubmit}
          schema={JSON.parse((activeTask as any).form_json)}
        />
      </main>
    );
  }

  if (task) {
    const taskToUse = task as any;
    const uiSchema = Object.assign(taskToUse.form_ui_schema || {}, {
      'ui:readonly': true,
    });
    return (
      <main>
        <Stack direction="horizontal" gap={3}>
          <Button href="/tasks">Go Back To List</Button>
          {gotToOtherTask(
            taskToUse.preceding_spiffworkflow_user_task_id,
            params.process_instance_id
          )}
          {gotToOtherTask(
            taskToUse.following_spiffworkflow_user_task_id,
            params.process_instance_id,
            'following'
          )}
          {gotToOtherTask(
            taskToUse.current_active_task_id,
            params.process_instance_id,
            'current'
          )}
        </Stack>
        <h3>process_instance_id: {params.process_instance_id}</h3>
        <h3>status: {(task as any).state}</h3>
        <Form
          formData={(task as any).data}
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
