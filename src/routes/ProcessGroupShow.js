import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import Button from 'react-bootstrap/Button'

export default function ProcessGroupShow() {
  let params = useParams();

  const [errro, setError] = useState(null);
  const [processGroup, setItem] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-groups/${params.process_group_id}`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          setItem(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      )
  }, []);

  if (processGroup) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <ProcessBreadcrumb processGroupId={processGroup.id} />
        <h2>Process Group: {processGroup.id}</h2>
        <ul>
        <Button href={`/process-models/${processGroup.id}/new`}>Add a process model</Button>
        <br />
        <br />
        {processGroup.process_models.map(process_model => (
          <li key={process_model.id}>
          <Link to={`/process-models/${process_model.id}`}>{process_model.id}</Link>
          </li>
        ))}
        </ul>
      </main>
    );
  } else {
    return (<></>)
  }
}
