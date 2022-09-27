import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Modal, Stack } from 'react-bootstrap';
import Editor from '@monaco-editor/react';

import ReactDiagramEditor from '../components/ReactDiagramEditor';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import HttpService from '../services/HttpService';
import ErrorContext from '../contexts/ErrorContext';

export default function ProcessModelEditDiagram() {
  const [showFileNameEditor, setShowFileNameEditor] = useState(false);
  const handleShowFileNameEditor = () => setShowFileNameEditor(true);

  const [scriptText, setScriptText] = useState('');
  const [scriptModeling, setScriptModeling] = useState(null);
  const [scriptElement, setScriptElement] = useState(null);
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const handleShowScriptEditor = () => setShowScriptEditor(true);

  interface ScriptUnitTest {
    id: string;
    inputJson: any;
    expectedOutputJson: any;
  }

  const [currentScriptUnitTest, setCurrentScriptUnitTest] =
    useState<ScriptUnitTest | null>(null);
  const [currentScriptUnitTestIndex, setCurrentScriptUnitTestIndex] =
    useState<number>(-1);
  const [unitTestResultIcon, setUnitTestResultIcon] = useState('');

  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const setErrorMessage = (useContext as any)(ErrorContext)[1];
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
        path: `/process-models/${params.process_group_id}/${params.process_model_id}/files/${params.file_name}`,
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
        `/admin/process-models/${params.process_group_id}/${params.process_model_id}/files/${fileNameWithExtension}`
      );
    }
  };

  const saveDiagram = (bpmnXML: any, fileName = params.file_name) => {
    setErrorMessage('');
    setBpmnXmlForDiagramRendering(bpmnXML);

    let url = `/process-models/${params.process_group_id}/${params.process_model_id}/files`;
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
      failureCallback: setErrorMessage,
      httpMethod,
      postBody: formData,
    });

    // after saving the file, make sure we null out newFileName
    // so it does not get used over the params
    setNewFileName('');
  };

  const onDeleteFile = (fileName = params.file_name) => {
    const url = `/process-models/${params.process_group_id}/${params.process_model_id}/files/${fileName}`;
    const httpMethod = 'DELETE';

    const navigateToProcessModelShow = (_httpResult: any) => {
      navigate(
        `/admin/process-models/${params.process_group_id}/${params.process_model_id}`
      );
    };
    HttpService.makeCallToBackend({
      path: url,
      successCallback: navigateToProcessModelShow,
      httpMethod,
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
  function makeApiHandler(event: any) {
    return function fireEvent(results: any) {
      event.eventBus.fire('spiff.service_tasks.returned', {
        serviceTaskOperators: results,
      });
    };
  }

  const onServiceTasksRequested = (event: any) => {
    HttpService.makeCallToBackend({
      path: `/service_tasks`,
      successCallback: makeApiHandler(event),
    });
  };

  const getScriptUnitTestElements = (element: any) => {
    const { extensionElements } = element.businessObject;
    if (extensionElements && extensionElements.values.length > 0) {
      const unitTestModdleElements = extensionElements
        .get('values')
        .filter(function getInstanceOfType(e: any) {
          return e.$instanceOf('spiffworkflow:unitTests');
        })[0];
      if (unitTestModdleElements) {
        return unitTestModdleElements.unitTests;
      }
    }
    return [];
  };
  const setScriptUnitTestElementWithIndex = (
    scriptIndex: number,
    element: any = scriptElement
  ) => {
    const unitTestsModdleElements = getScriptUnitTestElements(element);
    if (unitTestsModdleElements.length > 0) {
      setCurrentScriptUnitTest(unitTestsModdleElements[scriptIndex]);
      setCurrentScriptUnitTestIndex(scriptIndex);
    }
  };
  const onLaunchScriptEditor = (element: any, modeling: any) => {
    setScriptText(element.businessObject.script || '');
    setScriptModeling(modeling);
    setScriptElement(element);
    setScriptUnitTestElementWithIndex(0, element);
    handleShowScriptEditor();
  };
  const handleScriptEditorClose = () => {
    setUnitTestResultIcon('');
    setShowScriptEditor(false);
  };
  const handleEditorScriptChange = (value: any) => {
    setScriptText(value);
    (scriptModeling as any).updateProperties(scriptElement, {
      scriptFormat: 'python',
      script: value,
    });
  };
  const handleEditorScriptTestUnitInputChange = (value: any) => {
    if (currentScriptUnitTest) {
      currentScriptUnitTest.inputJson.value = value;
      (scriptModeling as any).updateProperties(scriptElement, {});
    }
  };
  const handleEditorScriptTestUnitOutputChange = (value: any) => {
    if (currentScriptUnitTest) {
      currentScriptUnitTest.expectedOutputJson.value = value;
      (scriptModeling as any).updateProperties(scriptElement, {});
    }
  };

  const generalEditorOptions = () => {
    return {
      glyphMargin: false,
      folding: false,
      lineNumbersMinChars: 0,
    };
  };
  const setPreviousScriptUnitTest = () => {
    setUnitTestResultIcon('');
    const newScriptIndex = currentScriptUnitTestIndex - 1;
    if (newScriptIndex >= 0) {
      setScriptUnitTestElementWithIndex(newScriptIndex);
    }
  };
  const setNextScriptUnitTest = () => {
    setUnitTestResultIcon('');
    const newScriptIndex = currentScriptUnitTestIndex + 1;
    const unitTestsModdleElements = getScriptUnitTestElements(scriptElement);
    if (newScriptIndex < unitTestsModdleElements.length) {
      setScriptUnitTestElementWithIndex(newScriptIndex);
    }
  };

  const processScriptUnitTestRunResult = (result: any) => {
    console.log(result);
    if (result.result === true) {
      setUnitTestResultIcon('✓');
    } else {
      setUnitTestResultIcon('✘');
    }
  };
  const runCurrentUnitTest = () => {
    if (currentScriptUnitTest && scriptElement) {
      HttpService.makeCallToBackend({
        path: `/process-models/${params.process_group_id}/${params.process_model_id}/script-unit-tests/run`,
        httpMethod: 'POST',
        successCallback: processScriptUnitTestRunResult,
        postBody: {
          script_unit_test_identifier: currentScriptUnitTest.id,
          bpmn_task_identifier: (scriptElement as any).id,
        },
      });
    }
  };
  const scriptUnitTestEditorElement = () => {
    if (currentScriptUnitTest) {
      let previousButtonDisable = true;
      if (currentScriptUnitTestIndex > 0) {
        previousButtonDisable = false;
      }
      let nextButtonDisable = true;
      const unitTestsModdleElements = getScriptUnitTestElements(scriptElement);
      if (currentScriptUnitTestIndex < unitTestsModdleElements.length - 1) {
        nextButtonDisable = false;
      }

      // unset current unit test if all tests were deleted
      if (unitTestsModdleElements.length < 1) {
        setCurrentScriptUnitTest(null);
        setCurrentScriptUnitTestIndex(-1);
      }
      return (
        <main>
          <Stack direction="horizontal" gap={3}>
            <Button
              data-qa="unit-test-previous-button"
              style={{ fontSize: '1.5em' }}
              onClick={setPreviousScriptUnitTest}
              variant="link"
              disabled={previousButtonDisable}
            >
              &laquo;
            </Button>
            <h3>Unit Test: {currentScriptUnitTest.id}</h3>
            <Button
              data-qa="unit-test-run"
              style={{ fontSize: '1.5em' }}
              onClick={runCurrentUnitTest}
            >
              Run
            </Button>
            {unitTestResultIcon}
            <Button
              data-qa="unit-test-next-button"
              style={{ fontSize: '1.5em' }}
              onClick={setNextScriptUnitTest}
              variant="link"
              disabled={nextButtonDisable}
            >
              &raquo;
            </Button>
          </Stack>
          <Stack direction="horizontal" gap={3}>
            <Stack>
              <div>Input Json:</div>
              <div>
                <Editor
                  height={200}
                  defaultLanguage="json"
                  options={Object.assign(generalEditorOptions(), {
                    minimap: { enabled: false },
                  })}
                  value={currentScriptUnitTest.inputJson.value}
                  onChange={handleEditorScriptTestUnitInputChange}
                />
              </div>
            </Stack>
            <Stack>
              <div>Expected Output Json:</div>
              <div>
                <Editor
                  height={200}
                  defaultLanguage="json"
                  options={Object.assign(generalEditorOptions(), {
                    minimap: { enabled: false },
                  })}
                  value={currentScriptUnitTest.expectedOutputJson.value}
                  onChange={handleEditorScriptTestUnitOutputChange}
                />
              </div>
            </Stack>
          </Stack>
        </main>
      );
    }
    return null;
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
        <Modal.Body>
          <Editor
            height={500}
            width="auto"
            options={generalEditorOptions()}
            defaultLanguage="python"
            defaultValue={scriptText}
            onChange={handleEditorScriptChange}
          />
          {scriptUnitTestEditorElement()}
        </Modal.Body>
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
          processModelId={params.process_model_id || ''}
          processGroupId={params.process_group_id || ''}
          saveDiagram={saveDiagram}
          onDeleteFile={onDeleteFile}
          diagramXML={bpmnXmlForDiagramRendering}
          fileName={processModelFile ? (processModelFile as any).name : null}
          diagramType="dmn"
        />
      );
    }
    return (
      <ReactDiagramEditor
        processModelId={params.process_model_id || ''}
        processGroupId={params.process_group_id || ''}
        saveDiagram={saveDiagram}
        onDeleteFile={onDeleteFile}
        diagramXML={bpmnXmlForDiagramRendering}
        fileName={processModelFile ? (processModelFile as any).name : null}
        diagramType="bpmn"
        onLaunchScriptEditor={onLaunchScriptEditor}
        onServiceTasksRequested={onServiceTasksRequested}
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
          linkProcessModel
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
  return null;
}
