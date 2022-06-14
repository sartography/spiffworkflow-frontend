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

import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-font/css/dmn-embedded.css";
import "dmn-js-properties-panel/dist/assets/properties-panel.css"


import magicPropertiesProviderModule from './magic';
import magicModdleDescriptor from './magic/magic';

// https://codesandbox.io/s/quizzical-lake-szfyo?file=/src/App.js was a handy reference
export default function ReactDiagramEditor(props) {
  const [diagramXML, setDiagramXML] = useState("");
  const [diagramModelerState, setDiagramModelerState] = useState(null);

  useEffect(() => {
    if (diagramModelerState) {
      return;
    }

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

    let diagramModeler = null;

    if (props.diagramType === "bpmn") {
      diagramModeler = new BpmnModeler({
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
          magicPropertiesProviderModule,
          spiffworkflow,
        ],
        moddleExtensions: {
          magic: magicModdleDescriptor
        }
      });
    } else if (props.diagramType === "dmn") {
      diagramModeler = new DmnModeler({
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
    }
    setDiagramModelerState(diagramModeler);

    diagramModeler.on('selection.changed', (event) => {
      const {
        error,
      } = event;

      // if (error) {
      //   return handleError(error);
      // }
      // console.log("WE DO GET EENT");
      // console.log("event", event)
      // console.log("event.newSelection", event.newSelection)
      // let element = diagramModelerState.get('selection').get()[0];
      // if (element) {
    });

    // modeler.get('modeling').updateProperties(modeler.get('elementRegistry').find(function (el) { return el.id === "Activity_0pxf6g1" }), {"name": "bye"})
    // diagramModeler.get('modeling').updateProperties(selectedElement,{"camunda:decisionRef": value});
    // window.modeler = diagramModeler;
    // diagramModeler.get('modeling').updateProperties(diagramModeler.get('elementRegistry').find(function (el) { return el.id === "Activity_0pxf6g1" }), {"name": "bye"})
    // diagramModeler.saveXML({ format: true })


  }, [props, diagramModelerState])

  // function changeNameID() {
  //   const elementRegistry = bpmnJS.get('elementRegistry'),
  //     modeling = bpmnJS.get('modeling');
  //
  //   const process = elementRegistry.get('Process_0sckl64');
  //
  //   modeling.updateProperties(process, {
  //     id: 'myProcessId',
  //     name: 'whatAGreatProcess'
  //   });
  //
  // }

  useEffect(() => {
    if (!diagramModelerState) {
      return;
    }

    diagramModelerState.on('import.done', (event) => {
      const {
        error,
      } = event;

      if (error) {
        return handleError(error);
      }

      let modeler = diagramModelerState;
      if (props.diagramType === "dmn" ) {
        modeler = diagramModelerState.getActiveViewer();
      }

      modeler.get('canvas').zoom('fit-viewport');
    });

    diagramModelerState.on('import.done', (event) => {
      const {
        error,
      } = event;

      if (error) {
        return handleError(error);
      }

      let modeler = diagramModelerState;
      if (props.diagramType === "dmn" ) {
        modeler = diagramModelerState.getActiveViewer();
      }

      modeler.get('canvas').zoom('fit-viewport');
    });

    var diagramXMLToUse = props.diagramXML || diagramXML
    if (diagramXMLToUse) {
      // let element = diagramModelerState.get('elementRegistry').get("ActScript");
      // if (element) {
      //   console.log("WE DO STUFF")
      //   console.log("element", element)
      //   // diagramModelerState.get('modeling').updateProperties(element, {scriptFormat: "python", script: "x=1", name: "bye"})
      //   diagramModelerState.get('modeling').updateProperties(element, {name: "HELLO_ID"})
      // }
      return displayDiagram(diagramModelerState, diagramXMLToUse);
    }

    if (!diagramXML) {
      if (props.url) {
        return fetchDiagramFromURL(props.url);
      } else if (props.fileName) {
        return fetchDiagramFromJsonAPI(props.process_model_id, props.fileName);
      } else {
        let newDiagramFileName = 'new_bpmn_diagram.bpmn';
        if (props.diagramType === "dmn" ) {
          newDiagramFileName = 'new_dmn_diagram.dmn';
        }
        return fetchDiagramFromURL(process.env.PUBLIC_URL + '/' + newDiagramFileName);
      }
    }

    return () => {
      diagramModelerState.destroy();
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

    function displayDiagram(diagramModelerToUse, diagramXMLToDisplay) {
      diagramModelerToUse.importXML(diagramXMLToDisplay);
    }
  }, [props, diagramXML, diagramModelerState]);

  function handleSave() {
    console.log("WE SAVE XML");
    diagramModelerState.saveXML({ format: true })
    .then(xmlObject => {
      console.log("xmlObject.xml", xmlObject.xml)
      props.saveDiagram(xmlObject.xml);
    })
  }

  function handleTest() {
    // let element = diagramModelerState.get('elementRegistry').get("ActScript");
    let element = diagramModelerState.get('selection').get()[0];
    if (element) {
      console.log("WE DO STUFF")
      console.log("element", element)
      // diagramModelerState.get('modeling').updateProperties(element, {scriptFormat: "python", script: "x=1", name: "bye"})
      diagramModelerState.get('modeling').updateProperties(element, {newKey: "newValue", script: "this be script", name: "hi", scriptFormat: "python"})
    }
  }

  return (
    <div>
      <Button onClick={handleSave} variant="danger">Save</Button>
      <Button onClick={handleTest} variant="danger">Test</Button>
    </div>
  );
}
