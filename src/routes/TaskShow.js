import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';

export default function TaskShow() {
  const [task, setTask] = useState(null);
  const params = useParams();

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

  if (task) {
    return (
      <main>
        <h1>Task ID: {task.id}</h1>
        <h3>process_instance_id: {task.process_instance_id}</h3>
        <h3>status: {task.status}</h3>
      </main>
    );
  }
}
