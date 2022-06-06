import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from './config';
import { HOT_AUTH_TOKEN } from './config';

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css"
import './bpmn-js-properties-panel.css';


// instantiating this here so it doesn't get
// reinstantiate below when useEffect is called
// multiple times by react
//
// if we could reliabley store this in a var or state
// then we may not need this out here
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
    BpmnPropertiesProviderModule
  ]
});

export default function ReactBpmnEditor(props) {
  const [diagramXML, setDiagramXML] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      return;
    }

    bpmnViewer.on('import.done', (event) => {
      const {
        error,
      } = event;

      if (error) {
        return handleError(error);
      }

      bpmnViewer.get('canvas').zoom('fit-viewport');
    });


    if (diagramXML) {
      // console.log("diagramXML", diagramXML)
      return displayDiagram(bpmnViewer, diagramXML);
    }

    // if (props.diagramXML) {
    //   if (!diagramXML) {
    //     console.log("TO SET DIAG");
    //     // console.log("props.diagramXML", props.diagramXML)
    //     setDiagramXML(props.diagramXML)
    //   }
    // }

    // if (props.url && !diagramXML) {
    if (!diagramXML) {
      return fetchDiagram(props.process_model_id, props.file_name);
    }

    return () => {
      bpmnViewer.destroy();
    }

    function fetchDiagram(process_model_id, file_name) {
      fetch(process.env.PUBLIC_URL + '/sample.bpmn', {
      // fetch(`${BACKEND_BASE_URL}/process-models/${process_model_id}/file/${file_name}`, {
        headers: new Headers({
          'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
        })
      })
        // .then(response => response.json())
        // .then(response_json => setDiagramXML(response_json.file_contents))
        .then(response => response.text())
        .then(response_json => setDiagramXML(response_json))
        .catch(err => handleError(err));
    }

    function handleError(err) {
      const { onError } = props;
      if (onError) {
        onError(err);
      }
    }

    function displayDiagram(bpmnViewerToUse, diagramXMLToDisplay) {
      setLoaded(true);
      // console.log("WE IMPORT");
      // console.log("diagramXML", diagramXMLToDisplay)
      bpmnViewerToUse.importXML(diagramXMLToDisplay);
    }
  }, [props, diagramXML, loaded]);

  return (
    <div></div>
    // <div className="content with-diagram" id="js-drop-zone">
    // <div className="canvas" id="canvas" ref={ containerRef }
    // style={{
    //   border: "1px solid #000000",
    //     height: "90vh",
    //     width: "90vw",
    //     margin: "auto"
    // }}
    // ></div>
    // <div className="properties-panel-parent" id="js-properties-panel"></div>
    // </div>
  );
}
