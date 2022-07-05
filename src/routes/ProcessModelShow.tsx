import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import FileInput from '../components/FileInput';

export default function ProcessModelShow() {
  const params = useParams();

  const [processModel, setProcessModel] = useState(null);
  const [processInstanceResult, setProcessInstanceResult] = useState(null);

  useEffect(() => {
    fetch(
      `${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setProcessModel(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [params]);

  const processModelRun = (processInstance: any) => {
    fetch(
      // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
      `${BACKEND_BASE_URL}/process-models/${processModel.process_group_id}/${processModel.id}/process-instances/${processInstance.id}/run`,
      {
        headers: new Headers({
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
        method: 'POST',
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setProcessInstanceResult(result);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const processInstanceCreateAndRun = () => {
    fetch(
      // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
      `${BACKEND_BASE_URL}/process-models/${processModel.process_group_id}/${processModel.id}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
        method: 'POST',
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          processModelRun(result);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  let processInstanceResultTag = '';
  if (processInstanceResult) {
    // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
    processInstanceResultTag = (
      <pre>
        {(processInstanceResult as any).status}:{' '}
        {JSON.stringify((processInstanceResult as any).data)}
      </pre>
    );
  }

  if (processModel) {
    const processModelFilesTag = (processModel as any).files.map(
      (fileBpmn: any) => {
        if (fileBpmn.name.match(/\.(dmn|bpmn)$/)) {
          let primarySuffix = '';
          // @ts-expect-error TS(2339) FIXME: Property 'primary_file_name' does not exist on typ... Remove this comment to see the full error message
          if (fileBpmn.name === processModel.primary_file_name) {
            primarySuffix = '- Primary File';
          }
          return (
            <li key={fileBpmn.name}>
              <Link
                // @ts-expect-error TS(2339) FIXME: Property 'process_group_id' does not exist on type... Remove this comment to see the full error message
                to={`/admin/process-models/${processModel.process_group_id}/${processModel.id}/file/${fileBpmn.name}`}
              >
                {fileBpmn.name}
              </Link>
              {primarySuffix}
            </li>
          );
        }
        return <li key={fileBpmn.name}>{fileBpmn.name}</li>;
      }
    );

    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb
          processGroupId={(processModel as any).process_group_id}
          processModelId={(processModel as any).id}
        />
        <h2>Process Model: {(processModel as any).id}</h2>
        {processInstanceResultTag}
        <FileInput
          processModelId={(processModel as any).id}
          processGroupId={(processModel as any).process_group_id}
        />
        <br />
        <Stack direction="horizontal" gap={3}>
          <Button onClick={processInstanceCreateAndRun} variant="primary">
            Run
          </Button>
          <Button
            href={`/admin/process-models/${
              (processModel as any).process_group_id
            }/${(processModel as any).id}/edit`}
            variant="secondary"
          >
            Edit process model
          </Button>
          <Button
            href={`/admin/process-models/${
              (processModel as any).process_group_id
            }/${(processModel as any).id}/file?file_type=bpmn`}
            variant="warning"
          >
            Add New BPMN File
          </Button>
          <Button
            href={`/admin/process-models/${
              (processModel as any).process_group_id
            }/${(processModel as any).id}/file?file_type=dmn`}
            variant="success"
          >
            Add New DMN File
          </Button>
        </Stack>
        <br />
        <br />
        <Link
          to={`/admin/process-models/${
            (processModel as any).process_group_id
          }/${(processModel as any).id}/process-instances`}
        >
          Process Instances
        </Link>
        <br />
        <br />
        <h3>Files</h3>
        <ul>{processModelFilesTag}</ul>
      </main>
    );
  }
}
