import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';

export default function ProcessInstanceShow() {
  const navigate = useNavigate();
  const params = useParams();

  const [processInstance, setProcessInstance] = useState(null);

  useEffect(() => {
    fetch(
      `${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setProcessInstance(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [params]);

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

  if (processInstance) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb
          // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
          processModelId={params.process_model_id}
          // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
          processGroupId={params.process_group_id}
          // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
          linkProcessModel="true"
        />
        <h2>Process Instance Id: {(processInstance as any).id}</h2>
        <h2>Data</h2>
        <div>
          <pre>{JSON.stringify((processInstance as any).data, null, 2)}</pre>
        </div>
        <Button onClick={deleteProcessInstance} variant="danger">
          Delete process instance
        </Button>
      </main>
    );
  }
}
