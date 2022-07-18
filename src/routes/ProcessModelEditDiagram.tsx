import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import Editor from '@monaco-editor/react';
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../services/UserService';

import ReactDiagramEditor from '../components/ReactDiagramEditor';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import HttpService from '../services/HttpService';

export default function ProcessModelEditDiagram() {
  const [showFileNameEditor, setShowFileNameEditor] = useState(false);
  const handleShowFileNameEditor = () => setShowFileNameEditor(true);

  const [scriptText, setScriptText] = useState('');
  const [scriptModeling, setScriptModeling] = useState(null);
  const [scriptElement, setScriptElement] = useState(null);
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const handleShowScriptEditor = () => setShowScriptEditor(true);

  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [processModelFile, setProcessModelFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [bpmnXmlForDiagramRendering, setBpmnXmlForDiagramRendering] =
    useState(null);

  useEffect(() => {
    const processResult = (result: any) => {
      setProcessModelFile(result);
      setBpmnXmlForDiagramRendering(result.file_contents);
    };

    if (params.file_name) {
      HttpService.makeCallToBackend({
        path: `/process-models/${params.process_group_id}/${params.process_model_id}/file/${params.file_name}`,
        successCallback: processResult,
      });
    }
  }, [params]);

  const handleFileNameCancel = () => {
    setShowFileNameEditor(false);
    setNewFileName('');
  };

  const navigateToProcessModelFile = (_result: any) => {
    if (!params.file_name) {
      const fileNameWithExtension = `${newFileName}.${searchParams.get(
        'file_type'
      )}`;
      navigate(
        `/admin/process-models/${params.process_group_id}/${params.process_model_id}/file/${fileNameWithExtension}`
      );
    }
  };

  const saveDiagram = (bpmnXML: any, fileName = params.file_name) => {
    setBpmnXmlForDiagramRendering(bpmnXML);

    let url = `/process-models/${params.process_group_id}/${params.process_model_id}/file`;
    let httpMethod = 'PUT';
    let fileNameWithExtension = fileName;

    if (newFileName) {
      fileNameWithExtension = `${newFileName}.${searchParams.get('file_type')}`;
      httpMethod = 'POST';
    } else {
      url += `/${fileNameWithExtension}`;
    }
    if (!fileNameWithExtension) {
      handleShowFileNameEditor();
      return;
    }

    const bpmnFile = new File([bpmnXML], fileNameWithExtension);
    const formData = new FormData();
    formData.append('file', bpmnFile);
    formData.append('fileName', bpmnFile.name);

    HttpService.makeCallToBackend({
      path: url,
      successCallback: navigateToProcessModelFile,
      httpMethod,
      postBody: formData,
    });
  };

  const handleFileNameSave = (event: any) => {
    event.preventDefault();
    setShowFileNameEditor(false);
    saveDiagram(bpmnXmlForDiagramRendering);
  };

  const newFileNameBox = () => {
    const fileExtension = `.${searchParams.get('file_type')}`;
    return (
      <Modal show={showFileNameEditor} onHide={handleFileNameCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Process Model File Name</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleFileNameSave}>
          <label>File Name:</label>
          <span>
            <input
              name="file_name"
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              autoFocus
            />
            {fileExtension}
          </span>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleFileNameCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  };

  const onLaunchScriptEditor = (element: any, modeling: any) => {
    setScriptText(element.businessObject.script || '');
    setScriptModeling(modeling);
    setScriptElement(element);
    handleShowScriptEditor();
  };
  const handleScriptEditorClose = () => {
    setShowScriptEditor(false);
  };
  const handleEditorChange = (value: any) => {
    setScriptText(value);
    // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
    scriptModeling.updateProperties(scriptElement, {
      scriptFormat: 'python',
      script: value,
    });
  };
  const scriptEditor = () => {
    let scriptName = '';
    if (scriptElement) {
      scriptName = (scriptElement as any).di.bpmnElement.name;
    }
    return (
      <Modal size="xl" show={showScriptEditor} onHide={handleScriptEditorClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editing Script: {scriptName}</Modal.Title>
        </Modal.Header>
        <Editor
          height={600}
          width="auto"
          defaultLanguage="python"
          defaultValue={scriptText}
          onChange={handleEditorChange}
        />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleScriptEditorClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const isDmn = () => {
    const fileName = params.file_name || '';
    return searchParams.get('file_type') === 'dmn' || fileName.endsWith('.dmn');
  };

  const appropriateEditor = () => {
    if (isDmn()) {
      return (
        <ReactDiagramEditor
          process_model_id={params.process_model_id}
          process_group_id={params.process_group_id}
          saveDiagram={saveDiagram}
          // @ts-expect-error TS(2322) FIXME: Type 'null' is not assignable to type 'string | un... Remove this comment to see the full error message
          diagramXML={bpmnXmlForDiagramRendering}
          fileName={processModelFile ? (processModelFile as any).name : null}
          diagramType="dmn"
        />
      );
    }
    return (
      <ReactDiagramEditor
        process_model_id={params.process_model_id}
        process_group_id={params.process_group_id}
        saveDiagram={saveDiagram}
        // @ts-expect-error TS(2322) FIXME: Type 'null' is not assignable to type 'string | un... Remove this comment to see the full error message
        diagramXML={bpmnXmlForDiagramRendering}
        fileName={processModelFile ? (processModelFile as any).name : null}
        diagramType="bpmn"
        onLaunchScriptEditor={onLaunchScriptEditor}
      />
    );
  };

  // if a file name is not given then this is a new model and the ReactDiagramEditor component will handle it
  if (bpmnXmlForDiagramRendering || !params.file_name) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb
          processGroupId={params.process_group_id}
          processModelId={params.process_model_id}
          // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'boolean |... Remove this comment to see the full error message
          linkProcessModel="true"
        />
        <h2>
          Process Model File
          {processModelFile ? `: ${(processModelFile as any).name}` : ''}
        </h2>
        {appropriateEditor()}
        {newFileNameBox()}
        {scriptEditor()}

        <div id="diagram-container" />
      </main>
    );
  }
}
