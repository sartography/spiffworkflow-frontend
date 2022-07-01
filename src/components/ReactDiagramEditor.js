/* eslint-disable sonarjs/cognitive-complexity */
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

import DmnModeler from 'dmn-js/lib/Modeler';
import {
  DmnPropertiesPanelModule,
  DmnPropertiesProviderModule,
} from 'dmn-js-properties-panel';

import React, { useRef, useEffect, useState } from 'react';
import spiffworkflowIO from 'bpmn-js-spiffworkflow/app/spiffworkflow/InputOutput';
import spiffworkflowPanel from 'bpmn-js-spiffworkflow/app/spiffworkflow/PropertiesPanel';

import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { HOT_AUTH_TOKEN, BACKEND_BASE_URL } from '../config';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import '../bpmn-js-properties-panel.css';
import 'bpmn-js/dist/assets/bpmn-js.css';

import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-js-decision-table-controls.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn-embedded.css';
import 'dmn-js-properties-panel/dist/assets/properties-panel.css';

import 'bpmn-js-spiffworkflow/app/css/app.css';

// https://codesandbox.io/s/quizzical-lake-szfyo?file=/src/App.js was a handy reference
export default function ReactDiagramEditor({
  processModelId,
  processGroupId,
  saveDiagram,
  diagramType,
  diagramXML,
  fileName,
  onLaunchScriptEditor,
  url,
}) {
  const [diagramXMLString, setDiagramXMLString] = useState('');
  const [diagramModelerState, setDiagramModelerState] = useState(null);
  const [performingXmlUpdates, setPerformingXmlUpdates] = useState(false);

  const alreadyImportedXmlRef = useRef(false);

  useEffect(() => {
    if (diagramModelerState) {
      return;
    }

    document.getElementById('diagram-container').innerHTML = '';
    const temp = document.createElement('template');

    temp.innerHTML = `
      <div class="content with-diagram" id="js-drop-zone">
        <div class="canvas" id="canvas"
                            style="border:1px solid #000000; height:90vh; width:90vw; margin:auto;"></div>
        <div class="properties-panel-parent" id="js-properties-panel"></div>
      </div>
    `;

    const frag = temp.content;
    document.getElementById('diagram-container').appendChild(frag);

    let diagramModeler = null;

    if (diagramType === 'bpmn') {
      diagramModeler = new BpmnModeler({
        container: '#canvas',
        keyboard: {
          bindTo: document,
        },
        propertiesPanel: {
          parent: '#js-properties-panel',
        },
        additionalModules: [
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          spiffworkflowIO,
          spiffworkflowPanel,
        ],
      });
    } else if (diagramType === 'dmn') {
      diagramModeler = new DmnModeler({
        container: '#canvas',
        keyboard: {
          bindTo: document,
        },
        drd: {
          propertiesPanel: {
            parent: '#js-properties-panel',
          },
          additionalModules: [
            DmnPropertiesPanelModule,
            DmnPropertiesProviderModule,
          ],
        },
      });
    }

    function handleLaunchScriptEditor(element) {
      if (onLaunchScriptEditor) {
        setPerformingXmlUpdates(true);
        const modeling = diagramModeler.get('modeling');
        onLaunchScriptEditor(element, modeling);
      }
    }

    setDiagramModelerState(diagramModeler);

    diagramModeler.on('launch.script.editor', (event) => {
      const { error, element } = event;
      if (error) {
        console.log(error);
      }
      handleLaunchScriptEditor(element);
    });
  }, [diagramModelerState, diagramType, onLaunchScriptEditor]);

  useEffect(() => {
    if (!diagramModelerState) {
      return undefined;
    }
    if (performingXmlUpdates) {
      return undefined;
    }

    function handleError(err) {
      console.log('ERROR:', err);
    }

    function onImportDone(event) {
      const { error } = event;

      if (error) {
        handleError(error);
        return;
      }

      let modeler = diagramModelerState;
      if (diagramType === 'dmn') {
        modeler = diagramModelerState.getActiveViewer();
      }

      // only get the canvas if the dmn active viewer is actually
      // a Modeler and not an Editor which is what it will when we are
      // actively editing a decision table
      if (modeler.constructor.name === 'Modeler') {
        modeler.get('canvas').zoom('fit-viewport');
      }
    }

    diagramModelerState.on('import.done', onImportDone);

    function displayDiagram(diagramModelerToUse, diagramXMLToDisplay) {
      if (alreadyImportedXmlRef.current) {
        return;
      }
      diagramModelerToUse.importXML(diagramXMLToDisplay);
      alreadyImportedXmlRef.current = true;
    }

    function fetchDiagramFromURL(urlToUse) {
      fetch(urlToUse)
        .then((response) => response.text())
        .then((text) => setDiagramXMLString(text))
        .catch((err) => handleError(err));
    }

    function fetchDiagramFromJsonAPI() {
      fetch(
        `${BACKEND_BASE_URL}/process-models/${processGroupId}/${processModelId}/file/${fileName}`,
        {
          headers: new Headers({
            Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => setDiagramXMLString(responseJson.file_contents))
        .catch((err) => handleError(err));
    }

    const diagramXMLToUse = diagramXML || diagramXMLString;
    if (diagramXMLToUse) {
      if (!diagramXMLString) {
        setDiagramXMLString(diagramXMLToUse);
      }
      displayDiagram(diagramModelerState, diagramXMLToUse);
      return undefined;
    }

    if (!diagramXMLString) {
      if (url) {
        fetchDiagramFromURL(url);
        return undefined;
      }
      if (fileName) {
        fetchDiagramFromJsonAPI();
        return undefined;
      }
      let newDiagramFileName = 'new_bpmn_diagram.bpmn';
      if (diagramType === 'dmn') {
        newDiagramFileName = 'new_dmn_diagram.dmn';
      }
      fetchDiagramFromURL(`${process.env.PUBLIC_URL}/${newDiagramFileName}`);
      return undefined;
    }

    return () => {
      diagramModelerState.destroy();
    };
  }, [
    diagramModelerState,
    diagramType,
    diagramXML,
    diagramXMLString,
    fileName,
    performingXmlUpdates,
    processGroupId,
    processModelId,
    url,
  ]);

  function handleSave() {
    diagramModelerState.saveXML({ format: true }).then((xmlObject) => {
      saveDiagram(xmlObject.xml);
    });
  }

  return (
    <div>
      <Button onClick={handleSave} variant="danger">
        Save
      </Button>
    </div>
  );
}

ReactDiagramEditor.propTypes = {
  processModelId: PropTypes.string.isRequired,
  processGroupId: PropTypes.string.isRequired,
  saveDiagram: PropTypes.func.isRequired,
  diagramType: PropTypes.string.isRequired,

  diagramXML: PropTypes.string,
  fileName: PropTypes.string,
  onLaunchScriptEditor: PropTypes.func,
  url: PropTypes.string,
};

ReactDiagramEditor.defaultProps = {
  diagramXML: null,
  fileName: null,
  onLaunchScriptEditor: null,
  url: null,
};
