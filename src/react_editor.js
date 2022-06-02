import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import React, { useEffect, useState } from "react";

import "bpmn-js-properties-panel/dist/assets/properties-panel.css"
import './bpmn-js-properties-panel.css';

export default function ReactEditor(props) {
  const containerRef = React.useRef();
  const container = containerRef.current;
  const [diagramXML, setDiagramXML] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      return;
    }
    const bpmnViewer = new BpmnModeler({
      container: container,
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
  }, [props, diagramXML, container]);

  return (
    <div className="content with-diagram" id="js-drop-zone">
    <div className="canvas" id="canvas" ref={ containerRef }
    style={{
      border: "1px solid #000000",
        height: "90vh",
        width: "90vw",
        margin: "auto"
    }}
    ></div>
    <div className="properties-panel-parent" id="js-properties-panel"></div>
    </div>
  );
}
