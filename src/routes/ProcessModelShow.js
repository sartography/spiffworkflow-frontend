import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import FileInput from '../components/FileInput'
import { Button, Stack } from 'react-bootstrap'

export default function ProcessModelShow() {
  let params = useParams();

  const [processModel, setProcessModel] = useState(null);
  const [processInstanceResult, setProcessInstanceResult] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          setProcessModel(result);
        },
        (error) => {
          console.log(error);
        }
      )
  }, [params]);

  const processInstanceCreateAndRun = ((event) => {
    fetch(`${BACKEND_BASE_URL}/process-models/${processModel.process_group_id}/${processModel.id}`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      }),
      method: 'POST',
    })
      .then(res => res.json())
      .then(
        (result) => {
          processModelRun(result);
        },
        (error) => {
          console.log(error);
        }
      )
  });

  const processModelRun = ((processInstance) => {
    fetch(`${BACKEND_BASE_URL}/process-models/${processModel.process_group_id}/${processModel.id}/process-instances/${processInstance.id}/run`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      }),
      method: 'POST',
    })
      .then(res => res.json())
      .then(
        (result) => {
          setProcessInstanceResult(result);
        },
        (error) => {
          console.log(error);
        }
      )
  });

  let processInstanceResultTag = ""
  if (processInstanceResult) {
    processInstanceResultTag = <pre>{processInstanceResult.status}: {JSON.stringify(processInstanceResult.data)}</pre>
  }

  if (processModel) {
    let processModelFilesTag = "";
    processModelFilesTag = processModel.files.map(file_bpmn => {
      if (file_bpmn.name === processModel.primary_file_name) {
        return (
          <li key={file_bpmn.name}>
          <Link to={`/process-models/${processModel.process_group_id}/${processModel.id}/file/${file_bpmn.name}`}>{file_bpmn.name}</Link> - Primary File
          </li>
        )
      } else {
        return (
          <li key={file_bpmn.name}>
          <Link to={`/process-models/${processModel.process_group_id}/${processModel.id}/file/${file_bpmn.name}`}>{file_bpmn.name}</Link>
          </li>
        )
      }
    })

    return (
      <main style={{ padding: "1rem 0" }}>
      <ProcessBreadcrumb
        processGroupId={processModel.process_group_id}
        processModelId={processModel.id}
      />
      <h2>Process Model: {processModel.id}</h2>
      {processInstanceResultTag}
      <FileInput processModel={processModel} />
      <br />
      <Stack direction="horizontal" gap={3}>
        <Button onClick={processInstanceCreateAndRun} variant="primary">Run</Button>
        <Button href={`/process-models/${processModel.process_group_id}/${processModel.id}/edit`} variant="secondary">Edit process model</Button>
        <Button href={`/process-models/${processModel.process_group_id}/${processModel.id}/file?file_type=bpmn`} variant="warning">Add New BPMN File</Button>
        <Button href={`/process-models/${processModel.process_group_id}/${processModel.id}/file?file_type=dmn`} variant="success">Add New DMN File</Button>
      </Stack>
      <br />
      <br />
      <Link to={`/process-models/${processModel.process_group_id}/${processModel.id}/process-instances`}>Process Instances</Link>
      <br />
      <br />
      <h3>Files</h3>
      <ul>{processModelFilesTag}</ul>
      </main>
    );
  } else {
    return (<></>)
  }
}

