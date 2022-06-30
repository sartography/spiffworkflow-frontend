import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '@rjsf/core';
import { Button } from 'react-bootstrap';

import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';

export default function TaskShow() {
  const [task, setTask] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const taskId = parseInt(params.task_id, 10);
    fetch(`${BACKEND_BASE_URL}/tasks/${taskId}`, {
      headers: new Headers({
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTask(result);
        },
        (newError) => {
          console.log(newError);
        }
      );
  }, [params.task_id]);

  const handleFormSubmit = (event) => {
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
        <h1>Task ID: {task.id}</h1>
        <h3>process_instance_id: {task.process_instance_id}</h3>
        <h3>status: {task.status}</h3>
        <Form
          formData={JSON.parse(task.spiffworkflow_task_data)}
          onSubmit={handleFormSubmit}
          schema={JSON.parse(task.form_json)}
        />
      </main>
    );
  }
}
