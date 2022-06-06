import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";

import ReactBpmnEditor from "../react_bpmn_editor"
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'

export default function ProcessModelEditDiagram() {
  let params = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  const [errro, setError] = useState(null);
  const [processModelFile, setProcessModelFile] = useState(null);

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
          setProcessModelFile(result);
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

  if (processModelFile) {
    console.log("processModelFile", processModelFile)
    return (
      <main style={{ padding: "1rem 0" }}>
      <ProcessBreadcrumb
        processGroupId={processModelFile.process_group_id}
        processModelId={processModelFile.process_model_id}
      />
      <h2>Process Model File: {processModelFile.name}</h2>
      <div id="bpmn-js-container-thing"></div>
      <ReactBpmnEditor
        process_model_id={params.process_model_id}
        file_name={processModelFile.name}
        diagramXML={processModelFile.file_contents}
        onError={ onError }
      />
      </main>
    );
  } else {
    return (<></>)
  }
}


