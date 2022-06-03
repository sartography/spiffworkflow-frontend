import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import React, { useEffect, useState } from "react";

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
      return displayDiagram(bpmnViewer, diagramXML);
    }

    if (props.url && !diagramXML) {
      return fetchDiagram(props.url);
    }

    return () => {
      bpmnViewer.destroy();
    }

    function fetchDiagram(url) {
      fetch(url)
        .then(response => response.text())
        .then(text => setDiagramXML(text))
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
