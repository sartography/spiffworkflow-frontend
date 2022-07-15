import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '@rjsf/core';
import { Button } from 'react-bootstrap';

import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../services/UserService';
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

  const handleFormSubmit = (event: any) => {
    // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
    fetch(`${BACKEND_BASE_URL}/tasks/${task.id}/submit`, {
      headers: new Headers({
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify(event.formData),
    }).then(
      () => {
        navigate('/tasks');
      },
      (newError) => {
        console.log(newError);
      }
    );
  };

  if (task) {
    // <JSONSchemaForm schema={JSON.parse(task.form_json)} />
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
