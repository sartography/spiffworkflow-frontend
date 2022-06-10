import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";

import ReactBpmnEditor from "../react_bpmn_editor"
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'

import { Button, Modal } from 'react-bootstrap';

export default function ProcessModelEditDiagram() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  let params = useParams();

  const [processModelFile, setProcessModelFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [newBpmnXml, setNewBpmnXml] = useState(null);
  const [bpmnXmlForDiagramRendering, setBpmnXmlForDiagramRendering] = useState(null);

  useEffect(() => {
    if (params.file_name) {
      fetch(`${BACKEND_BASE_URL}/process-models/${params.process_model_id}/file/${params.file_name}`, {
        headers: new Headers({
          'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
        })
      })
        .then(res => res.json())
        .then(
          (result) => {
            setProcessModelFile(result);
            setBpmnXmlForDiagramRendering(result.file_contents);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            console.log(error);
          }
        )
    }
  }, [params]);

  function onError(err) {
    console.log('ERROR:', err);
  }

  const handleFileNameCancel = () => setShow(false);

  const handleFileNameSave = (() => {
    setShow(false);
    saveDiagram(newBpmnXml);
  });

  const saveDiagram = ((bpmnXML, fileName = params.file_name) => {
    setNewBpmnXml(bpmnXML);

    let url = `${BACKEND_BASE_URL}/process-models/${params.process_model_id}/file`;
    let httpMethod = 'PUT'

    if (newFileName) {
      fileName = newFileName;
      httpMethod = 'POST'
    } else {
      url += `/${fileName}`;
    }
    if (!fileName) {
      handleShow();
      return;
    }


    let bpmnFile = new File([bpmnXML], fileName);
    const formData = new FormData();
    formData.append('file', bpmnFile);
    formData.append('fileName', bpmnFile.name);
    fetch(url, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`,
      }),
      method: httpMethod,
      body: formData,
    })
      .then(res => res.json())
      .then(
        (result) => {
          setBpmnXmlForDiagramRendering(bpmnXML);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
  });

  if (processModelFile) {
    return (
      <main style={{ padding: "1rem 0" }}>
      <ProcessBreadcrumb
        processGroupId={processModelFile.process_group_id}
        processModelId={processModelFile.process_model_id}
        linkProcessModel="true"
      />
      <h2>Process Model File: {processModelFile.name}</h2>
      <ReactBpmnEditor
        process_model_id={params.process_model_id}
        file_name={processModelFile.name}
        diagramXML={bpmnXmlForDiagramRendering}
        onError={ onError }
        saveDiagram={ saveDiagram }
      />
      <div id="bpmn-js-container-thing"></div>
      </main>
    );
  } else if (!params.file_name) {
    return (
      <main style={{ padding: "1rem 0" }}>
      <ProcessBreadcrumb
        processGroupId={params.process_group_id}
        processModelId={params.process_model_id}
        linkProcessModel="true"
      />
      <h2>Process Model File</h2>
      <ReactBpmnEditor
        process_model_id={params.process_model_id}
        onError={ onError }
        saveDiagram={ saveDiagram }
      />

      <Modal show={show} onHide={handleFileNameCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Process Model File Name</Modal.Title>
        </Modal.Header>
        <label>File Name:</label>
        <input
          name='file_name'
          type='text'
          value={newFileName}
          onChange={e => setNewFileName(e.target.value)}
        />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFileNameCancel}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFileNameSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


      <div id="bpmn-js-container-thing"></div>
      </main>
    );
  } else {
    return (<></>)
  }
}


