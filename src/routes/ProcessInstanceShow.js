import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';

export default function ProcessInstanceShow() {
  const navigate = useNavigate();
  const params = useParams();

  const deleteProcessInstance = () => {
    fetch(
      `${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
        method: 'DELETE',
      }
    ).then(
      () => {
        navigate(
          `/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances`
        );
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <main style={{ padding: '1rem 0' }}>
      <ProcessBreadcrumb
        processModelId={params.process_model_id}
        processGroupId={params.process_group_id}
        linkProcessModel="true"
      />
      <Button onClick={deleteProcessInstance} variant="danger">
        Delete process instance
      </Button>
    </main>
  );
}
