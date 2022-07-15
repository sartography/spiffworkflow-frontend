import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../services/UserService';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import HttpService from '../services/HttpService';

export default function ProcessInstanceShow() {
  const navigate = useNavigate();
  const params = useParams();

  const [processInstance, setProcessInstance] = useState(null);

  useEffect(() => {
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}`,
      successCallback: setProcessInstance,
    });
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
          processModelId={params.process_model_id}
          processGroupId={params.process_group_id}
          // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'boolean |... Remove this comment to see the full error message
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
