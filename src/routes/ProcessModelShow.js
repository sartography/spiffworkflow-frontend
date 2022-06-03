import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";


export default function ProcessModelShow() {
  let params = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  const [errro, setError] = useState(null);
  const [item, setItem] = useState(null);

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
          setItem(result);
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

  if (item) {
    return (
      <main style={{ padding: "1rem 0" }}>
      <h2>Process Model: {item.id}</h2>
      <ul>
      {item.files.map(file_bpmn => (
        <li key={file_bpmn.name}>
        <Link to={`/process-models/${params.process_model_id}/file/${file_bpmn.name}`}>{file_bpmn.name}</Link>
        </li>
      ))}
      </ul>
      </main>
    );
  } else {
    return (
      <h2>None Found</h2>
    )
  }
}

