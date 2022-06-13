import DmnModeler from 'dmn-js/lib/Modeler';

import {
  DmnPropertiesPanelModule,
  DmnPropertiesProviderModule,
} from 'dmn-js-properties-panel';

import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from './config';
import { HOT_AUTH_TOKEN } from './config';

import Button from 'react-bootstrap/Button';

import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-font/css/dmn-embedded.css";
import "dmn-js-properties-panel/dist/assets/properties-panel.css"


export default function ReactDmnEditor(props) {
  const [diagramXML, setDiagramXML] = useState("");
  const [dmnViewerState, setDmnViewerState] = useState(null);

  useEffect(() => {
    document.getElementById("diagram-container").innerHTML = "";
    var temp = document.createElement('template');

    temp.innerHTML = `
      <div class="content with-diagram" id="js-drop-zone">
        <div class="canvas" id="canvas"
                            style="border:1px solid #000000; height:90vh; width:90vw; margin:auto;"></div>
        <div class="properties-panel-parent" id="js-properties-panel"></div>
      </div>
    `

    var frag = temp.content;
    document.getElementById("diagram-container").appendChild(frag);

    const dmnViewer = new DmnModeler({
      container: "#canvas",
      keyboard: {
        bindTo: document
      },
      drd: {
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          DmnPropertiesPanelModule,
          DmnPropertiesProviderModule,
        ]
      }
    });
    setDmnViewerState(dmnViewer)
  }, [])

  useEffect(() => {
    if (!dmnViewerState) {
      return;
    }

    dmnViewerState.on('import.done', (event) => {
      const {
        error,
      } = event;

      if (error) {
        return handleError(error);
      }

      dmnViewerState.getActiveViewer().get('canvas').zoom('fit-viewport');
    });

    var diagramXMLToUse = props.diagramXML || diagramXML
    if (diagramXMLToUse) {
      return displayDiagram(dmnViewerState, diagramXMLToUse);
    }

    if (!diagramXML) {
      if (props.url) {
        return fetchDiagramFromURL(props.url);
      } else if (props.fileName) {
        return fetchDiagramFromJsonAPI(props.process_model_id, props.fileName);
      } else {
        return fetchDiagramFromURL(process.env.PUBLIC_URL + '/new_dmn_diagram.dmn');
      }
    }

    return () => {
      dmnViewerState.destroy();
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

    function displayDiagram(dmnViewerToUse, diagramXMLToDisplay) {
      dmnViewerToUse.importXML(diagramXMLToDisplay);
    }
  }, [props, diagramXML, dmnViewerState]);

  function handleSave() {
    dmnViewerState.saveXML({ format: true })
    .then(dmnXmlObject => {
      props.saveDiagram(dmnXmlObject.xml);
    })
  }

  return (
    <div>
      <Button onClick={handleSave} variant="danger">Save</Button>
    </div>
  );
}
