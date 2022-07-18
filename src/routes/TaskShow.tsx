import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '@rjsf/core';
import { Button } from 'react-bootstrap';

import HttpService from '../services/HttpService';

export default function TaskShow() {
  const [task, setTask] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // @ts-expect-error TS(2345) FIXME: Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const taskId = parseInt(params.task_id, 10);
    HttpService.makeCallToBackend({
      path: `/tasks/${taskId}`,
      successCallback: setTask,
    });
  }, [params.task_id]);

  const navigateToTasks = (_result: any) => {
    navigate(`/tasks`);
  };

  const handleFormSubmit = (event: any) => {
    HttpService.makeCallToBackend({
      // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
      path: `/tasks/${task.id}/submit`,
      successCallback: navigateToTasks,
      httpMethod: 'POST',
      postBody: event.formData,
    });
  };

  if (task) {
    return (
      <main>
        <Button href="/tasks">Go Back</Button>
        <h1>Task ID: {(task as any).id}</h1>
        <h3>process_instance_id: {(task as any).process_instance_id}</h3>
        <h3>status: {(task as any).status}</h3>
        <Form
          formData={JSON.parse((task as any).spiffworkflow_task_data)}
          onSubmit={handleFormSubmit}
          schema={JSON.parse((task as any).form_json)}
        />
      </main>
    );
  }
  return null;
}
