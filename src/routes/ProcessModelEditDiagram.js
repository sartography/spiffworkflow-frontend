import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";

import ReactBpmnEditor from "../react_bpmn_editor"

export default function ProcessModelEditDiagram() {
  let params = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  const [errro, setError] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-models/${params.process_model_id}/file/${params.file_name}`, {
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

  function onError(err) {
    console.log('ERROR:', err);
  }

      // url={process.env.PUBLIC_URL + '/sample.bpmn'}
      // diagramXML={item.file_contents}
      // <h2>Process Model File: {item.name}</h2>
  if (item) {
    return (
      <main style={{ padding: "1rem 0" }}>
      <ReactBpmnEditor
        process_model_id={params.process_model_id}
        file_name={item.name}
        onError={ onError }
      />
      </main>
    );
  } else {
    return (
      <h2>None Found</h2>
    )
  }
}


