import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import FileInput from '../components/FileInput';
import ReactFormBuilder from '../components/ReactFormBuilder';

const formSchema = `
{
  "title": "Enter a number to multiply with system number",
  "description": "Your number will be multiplied with {{system_generated_number}}",
  "type": "object",
  "required": ["user_generated_number"],
  "properties": {
    "system_generated_number": {"type": "integer", "title": "System Generated Number", "default": 0},
    "user_generated_number": {"type": "integer", "title": "User Generated Number", "default": 0}
  }
}
`;

export default function ProcessModelShow() {
  const params = useParams();

  const [processModel, setProcessModel] = useState(null);
  const [processInstanceResult, setProcessInstanceResult] = useState(null);
  const [reloadModel, setReloadModel] = useState(false);

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
          setReloadModel(false);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [params, reloadModel]);

  const processModelRun = (processInstance: any) => {
    fetch(
      `${BACKEND_BASE_URL}/process-models/${
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        processModel.process_group_id
      }/${
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        processModel.id
      }/process-instances/${processInstance.id}/run`,
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
      `${BACKEND_BASE_URL}/process-models/${
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        processModel.process_group_id
      }/${
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        processModel.id
      }`,
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

  const onUploadedCallback = () => {
    setReloadModel(true);
  };

  if (processModel) {
    const processModelFilesTag = (processModel as any).files.map(
      (fileBpmn: any) => {
        if (fileBpmn.name.match(/\.(dmn|bpmn)$/)) {
          let primarySuffix = '';
          if (fileBpmn.name === (processModel as any).primary_file_name) {
            primarySuffix = '- Primary File';
          }
          return (
            <li key={fileBpmn.name}>
              <Link
                to={`/admin/process-models/${
                  (processModel as any).process_group_id
                }/${(processModel as any).id}/file/${fileBpmn.name}`}
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
          onUploadedCallback={onUploadedCallback}
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
        <h3>Process Instances</h3>
        <ul>
          <li>
            <Link
              to={`/admin/process-models/${
                (processModel as any).process_group_id
              }/${(processModel as any).id}/process-instances`}
              data-qa="process-instance-list-link"
            >
              List
            </Link>
          </li>
          <li>
            <Link
              to={`/admin/process-models/${
                (processModel as any).process_group_id
              }/${(processModel as any).id}/process-instances/reports`}
              data-qa="process-instance-reports-link"
            >
              Reports
            </Link>
          </li>
        </ul>
        <br />
        <br />
        <h3>Files</h3>
        <ul>{processModelFilesTag}</ul>
      </main>
    );
  }
  <ReactFormBuilder schema={formSchema} uischema="" />;
}
