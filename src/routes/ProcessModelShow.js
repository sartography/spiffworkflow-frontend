import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import 'bootstrap/dist/css/bootstrap.css';

export default function ProcessModelShow() {
  let params = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  const [errro, setError] = useState(null);
  const [processModel, setProcessModel] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-models/${params.process_model_id}`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setProcessModel(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  if (processModel) {
    return (
      <main style={{ padding: "1rem 0" }}>
      <ProcessBreadcrumb
        processGroupId={processModel.process_group_id}
        processModelId={params.process_model_id}
      />
      <h2>Process Model: {processModel.id}</h2>
      <ul>
      {processModel.files.map(file_bpmn => (
        <li key={file_bpmn.name}>
        <Link to={`/process-models/${params.process_model_id}/file/${file_bpmn.name}`}>{file_bpmn.name}</Link>
        </li>
      ))}
      </ul>
      </main>
    );
  } else {
    return (<></>)
  }
}

