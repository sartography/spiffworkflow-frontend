import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import FileInput from '../components/FileInput'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.css';

export default function ProcessModelShow() {
  let params = useParams();

  const [error, setError] = useState(null);
  const [processModel, setProcessModel] = useState(null);
  const [processInstanceResult, setProcessInstanceResult] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-models/${params.process_model_id}`, {
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
          setError(error);
        }
      )
  }, []);

  const processModelRun = ((event) => {
    fetch(`${BACKEND_BASE_URL}/process-models/${processModel.id}`, {
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
          setError(error);
        }
      )
  });

  let processInstanceResultTag = ""
  if (processInstanceResult) {
    processInstanceResultTag = <pre>{processInstanceResult.status}: {JSON.stringify(processInstanceResult.data)}</pre>
  }

  if (processModel) {
    console.log("processModel", processModel)
    let processInstanceListTag = "hello"
    processInstanceListTag = processModel.files.map(file_bpmn => {
      if (file_bpmn.name === processModel.primary_file_name) {
        return (
          <li key={file_bpmn.name}>
          <Link to={`/process-models/${processModel.id}/file/${file_bpmn.name}`}>{file_bpmn.name}</Link> - Primary File
          </li>
        )
      } else {
        return (
          <li key={file_bpmn.name}>
          <Link to={`/process-models/${processModel.id}/file/${file_bpmn.name}`}>{file_bpmn.name}</Link>
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
      <Button onClick={processModelRun} variant="primary">Run Primary</Button>
      <br />
      <br />
      <Link to={`/process-models/${processModel.id}/process-instances`}>Process Instances</Link>
      <br />
      <br />
      <ul>{processInstanceListTag}</ul>
      </main>
    );
  } else {
    return (<></>)
  }
}

