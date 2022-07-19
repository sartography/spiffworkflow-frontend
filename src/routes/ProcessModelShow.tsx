import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import FileInput from '../components/FileInput';
import HttpService from '../services/HttpService';

export default function ProcessModelShow() {
  const params = useParams();

  const [processModel, setProcessModel] = useState({});
  const [processInstanceResult, setProcessInstanceResult] = useState(null);
  const [reloadModel, setReloadModel] = useState(false);

  useEffect(() => {
    const processResult = (result: object) => {
      setProcessModel(result);
      setReloadModel(false);
    };
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}`,
      successCallback: processResult,
    });
  }, [params, reloadModel]);

  const processModelRun = (processInstance: any) => {
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${processInstance.id}/run`,
      successCallback: setProcessInstanceResult,
      httpMethod: 'POST',
    });
  };

  const processInstanceCreateAndRun = () => {
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}`,
      successCallback: processModelRun,
      httpMethod: 'POST',
    });
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

  const processModelFileList = () => {
    let constructedTag;
    const tags = (processModel as any).files.map((processModelFile: any) => {
      if (processModelFile.name.match(/\.(dmn|bpmn)$/)) {
        let primarySuffix = '';
        if (processModelFile.name === (processModel as any).primary_file_name) {
          primarySuffix = '- Primary File';
        }
        constructedTag = (
          <li key={processModelFile.name}>
            <Link
              to={`/admin/process-models/${
                (processModel as any).process_group_id
              }/${(processModel as any).id}/file/${processModelFile.name}`}
            >
              {processModelFile.name}
            </Link>
            {primarySuffix}
          </li>
        );
      } else if (processModelFile.name.match(/\.(json)$/)) {
        constructedTag = (
          <li key={processModelFile.name}>
            <Link
              to={`/admin/process-models/${
                (processModel as any).process_group_id
              }/${(processModel as any).id}/form/${processModelFile.name}`}
            >
              {processModelFile.name}
            </Link>
          </li>
        );
      } else {
        constructedTag = (
          <li key={processModelFile.name}>{processModelFile.name}</li>
        );
      }
      return constructedTag;
    });

    return <ul>{tags}</ul>;
  };

  const processInstancesUl = () => {
    return (
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
    );
  };

  const processModelButtons = () => {
    return (
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
        <Button
          href={`/admin/process-models/${
            (processModel as any).process_group_id
          }/${(processModel as any).id}/form`}
          variant="info"
        >
          Add New JSON File
        </Button>
      </Stack>
    );
  };

  if (Object.keys(processModel).length > 1) {
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
        {processModelButtons()}
        <br />
        <br />
        <h3>Process Instances</h3>
        {processInstancesUl()}
        <br />
        <br />
        <h3>Files</h3>
        {processModelFileList()}
      </main>
    );
  }
}
