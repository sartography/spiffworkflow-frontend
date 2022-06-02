import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import React, { useEffect, useState } from "react";

// import "bpmn-js/dist/assets/diagram-js.css"
// import "bpmn-js/dist/assets/bpmn-js.css"
// import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css"

import "bpmn-js-properties-panel/dist/assets/properties-panel.css"
import './bpmn-js-properties-panel.css';
    console.log("WE CALL HERE1");
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

export default function ReactEditor(props) {
    console.log("WE CALL HERE2");
  // const containerRef = React.useRef();
  // const container = containerRef.current;
  const [diagramXML, setDiagramXML] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      return;
    }
    console.log("HERE1");
    // console.log("loaded", loaded)
    // const bpmnViewer = new BpmnModeler({
    //   container: "#canvas",
    //   keyboard: {
    //     bindTo: document
    //   },
    //   propertiesPanel: {
    //     parent: '#js-properties-panel'
    //   },
    //   additionalModules: [
    //     BpmnPropertiesPanelModule,
    //     BpmnPropertiesProviderModule
    //   ]
    // });
    console.log("HERE2");

    bpmnViewer.on('import.done', (event) => {
      const {
        error,
      } = event;

      if (error) {
        return handleError(error);
      }

      bpmnViewer.get('canvas').zoom('fit-viewport');
    });
    console.log("HERE3");


    if (diagramXML) {
    console.log("HERE4");
      return displayDiagram(bpmnViewer, diagramXML);
    }

    if (props.url && !diagramXML) {
    console.log("HERE5");
      return fetchDiagram(props.url);
    }
    console.log("HERE6");

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
      console.log("loadedSet", loaded)
    }
  // }, [props, diagramXML, container, loaded]);
  }, [props, diagramXML, loaded]);

  // console.log("WE RETURN")
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
