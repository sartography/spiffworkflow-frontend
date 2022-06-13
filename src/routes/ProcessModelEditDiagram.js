import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import ReactBpmnEditor from "../react_bpmn_editor"
import ReactDmnEditor from "../react_dmn_editor"
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'

import { Button, Modal } from 'react-bootstrap';

export default function ProcessModelEditDiagram() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    let httpMethod = 'PUT';
    let fileNameWithExtension = fileName;

    if (newFileName) {
      fileNameWithExtension = `${newFileName}.${searchParams.get('file_type')}`;
      httpMethod = 'POST'
    } else {
      url += `/${fileNameWithExtension}`;
    }
    if (!fileNameWithExtension) {
      handleShow();
      return;
    }

    let bpmnFile = new File([bpmnXML], fileNameWithExtension);
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
            navigate(`/process-models/${params.process_group_id}/${params.process_model_id}/file/${fileNameWithExtension}`);
          }
        },
        (error) => {
          console.log(error);
        }
      )
  });

  const newFileNameBox = (() => {
    let fileExtension = `.${searchParams.get('file_type')}`;
    return (
      <Modal show={show} onHide={handleFileNameCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Process Model File Name</Modal.Title>
        </Modal.Header>
        <label>File Name:</label>
        <span>
          <input
            name='file_name'
            type='text'
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
          />
          {fileExtension}
        </span>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFileNameCancel}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFileNameSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  });

  const isDmn = (() => {
    const file_name = params.file_name || "";
    if (searchParams.get('file_type') === "dmn" || file_name.endsWith(".dmn") ) {
      return true;
    }
    return false;
  });

  const appropriateEditor = (() => {
    if (isDmn()) {
      return (
        <ReactDmnEditor
          process_model_id={params.process_model_id}
          onError={ onError }
          saveDiagram={ saveDiagram }
          diagramXML={bpmnXmlForDiagramRendering}
          fileName={processModelFile ? processModelFile.name : null}
        />
      )
    }
    return (
      <ReactBpmnEditor
        process_model_id={params.process_model_id}
        onError={ onError }
        saveDiagram={ saveDiagram }
        diagramXML={bpmnXmlForDiagramRendering}
        fileName={processModelFile ? processModelFile.name : null}
      />
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
      {appropriateEditor()}
      {newFileNameBox()}

      <div id="diagram-container"></div>
    </main>
  );
}
