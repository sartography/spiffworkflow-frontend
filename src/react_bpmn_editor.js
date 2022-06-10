import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from './config';
import { HOT_AUTH_TOKEN } from './config';
import spiffworkflow from 'bpmn-js-spiffworkflow/app/spiffworkflow';

import Button from 'react-bootstrap/Button';

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css"
import './bpmn-js-properties-panel.css';
import "bpmn-js/dist/assets/bpmn-js.css";


// https://codesandbox.io/s/quizzical-lake-szfyo?file=/src/App.js was a handy reference
export default function ReactBpmnEditor(props) {
  const [diagramXML, setDiagramXML] = useState("");
  const [bpmnViewerState, setBpmnViewerState] = useState(null);

  useEffect(() => {
    document.getElementById("bpmn-js-container-thing").innerHTML = "";
    var temp = document.createElement('template');

    temp.innerHTML = `
      <div class="content with-diagram" id="js-drop-zone">
        <div class="canvas" id="canvas"
                            style="border:1px solid #000000; height:90vh; width:90vw; margin:auto;"></div>
        <div class="properties-panel-parent" id="js-properties-panel"></div>
      </div>
    `

    var frag = temp.content;
    document.getElementById("bpmn-js-container-thing").appendChild(frag);

    const bpmnViewer = new BpmnModeler({
      container: "#canvas",
      keyboard: {
        bindTo: document
      },
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        spiffworkflow,
      ]
    });
    setBpmnViewerState(bpmnViewer)
  }, [])

  useEffect(() => {
    if (!bpmnViewerState) {
      return;
    }

    bpmnViewerState.on('import.done', (event) => {
      const {
        error,
      } = event;

      if (error) {
        return handleError(error);
      }

      bpmnViewerState.get('canvas').zoom('fit-viewport');
    });

    var diagramXMLToUse = props.diagramXML || diagramXML
    if (diagramXMLToUse) {
      return displayDiagram(bpmnViewerState, diagramXMLToUse);
    }

    if (!diagramXML) {
      if (props.url) {
        return fetchDiagramFromURL(props.url);
      } else if (props.fileName) {
        return fetchDiagramFromJsonAPI(props.process_model_id, props.fileName);
      } else {
        return fetchDiagramFromURL(process.env.PUBLIC_URL + '/new_bpmn_diagram.bpmn');
      }
    }

    return () => {
      bpmnViewerState.destroy();
    }

    function fetchDiagramFromURL(url) {
      fetch(url)
        .then(response => response.text())
        .then(text => setDiagramXML(text))
        .catch(err => handleError(err));
    }

    function fetchDiagramFromJsonAPI(processModelId, fileName) {
      fetch(`${BACKEND_BASE_URL}/process-models/${processModelId}/file/${fileName}`, {
        headers: new Headers({
          'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
        })
      })
        .then(response => response.json())
        .then(response_json => setDiagramXML(response_json.file_contents))
        .catch(err => handleError(err));
    }

    function handleError(err) {
      const { onError } = props;
      if (onError) {
        onError(err);
      }
    }

    function displayDiagram(bpmnViewerToUse, diagramXMLToDisplay) {
      bpmnViewerToUse.importXML(diagramXMLToDisplay);
    }
  }, [props, diagramXML, bpmnViewerState]);

  function handleSave() {
    bpmnViewerState.saveXML({ format: true })
    .then(bpmnXmlObject => {
      props.saveDiagram(bpmnXmlObject.xml);
    })
  }

  return (
    <div>
      <Button onClick={handleSave} variant="danger">Save</Button>
    </div>
  );
}
