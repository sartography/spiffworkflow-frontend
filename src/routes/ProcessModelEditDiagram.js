import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useNavigate, useParams } from "react-router-dom";

import ReactBpmnEditor from "../react_bpmn_editor"
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'

import { Button, Modal } from 'react-bootstrap';

export default function ProcessModelEditDiagram() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  let params = useParams();
  const navigate = useNavigate();

  const [processModelFile, setProcessModelFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
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
    saveDiagram(bpmnXmlForDiagramRendering);
  });

  const saveDiagram = ((bpmnXML, fileName = params.file_name) => {
    setBpmnXmlForDiagramRendering(bpmnXML);

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
          if (!params.file_name) {
            navigate(`/process-models/${params.process_group_id}/${params.process_model_id}/file/${newFileName}`);
          }
        },
        (error) => {
          console.log(error);
        }
      )
  });

  return (
    <main style={{ padding: "1rem 0" }}>
      <ProcessBreadcrumb
        processGroupId={params.process_group_id}
        processModelId={params.process_model_id}
        linkProcessModel="true"
      />
      <h2>Process Model File{processModelFile ? `: ${processModelFile.name}` : ""}</h2>
      <ReactBpmnEditor
        process_model_id={params.process_model_id}
        onError={ onError }
        saveDiagram={ saveDiagram }
        diagramXML={bpmnXmlForDiagramRendering}
        fileName={processModelFile ? processModelFile.name : null}
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
}
