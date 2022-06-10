import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import FileInput from '../components/FileInput'
import { Button, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';

export default function ProcessModelShow() {
  let params = useParams();
  const navigate = useNavigate();

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
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
  }, [params]);

  const processModelRun = ((event) => {
    fetch(`${BACKEND_BASE_URL}/process-models/${processModel.process_group_id}/${processModel.id}`, {
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

  const deleteProcessModel = (() => {
    fetch(`${BACKEND_BASE_URL}/process-models/${processModel.process_group_id}/${processModel.id}`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      }),
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(
        (result) => {
          navigate(`/process-groups/${params.process_group_id}`);
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
    let processInstanceListTag = "";
    processInstanceListTag = processModel.files.map(file_bpmn => {
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
        <Button onClick={processModelRun} variant="primary">Run Primary</Button>
        <Button onClick={deleteProcessModel} variant="danger">Delete Process Model</Button>
      </Stack>
      <br />
      <br />
      <Link to={`/process-models/${processModel.process_group_id}/${processModel.id}/process-instances`}>Process Instances</Link>
      <br />
      <br />
      <ul>{processInstanceListTag}</ul>
      </main>
    );
  } else {
    return (<></>)
  }
}

