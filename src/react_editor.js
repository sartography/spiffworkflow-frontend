import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import React, { useEffect, useState } from "react";

import "bpmn-js-properties-panel/dist/assets/properties-panel.css"
import './bpmn-js-properties-panel.css';
    // const bpmnViewer = new BpmnModeler({
    //   container: '#js-canvas',
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

export default function ReactEditor(props) {
  const containerRef = React.useRef();
  const container = containerRef.current;
  const [diagramXML, setDiagramXML] = useState("");
  const [bpmnViewer, setBpmnViewer] = useState(null);
  // var bpmnViewer = null;
    // const bpmnViewer = new BpmnModeler({
    //   container: container,
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

  // var bpmnViewer = null

  useEffect(() => {
    // if (!bpmnViewer) {
    console.log("diagramXML3", diagramXML)
      var newBpmnViewer = new BpmnModeler({
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

      setBpmnViewer(newBpmnViewer);

      newBpmnViewer.on('import.done', (event) => {
        const {
          error,
          warnings
        } = event;

        if (error) {
          return handleError(error);
        }

        newBpmnViewer.get('canvas').zoom('fit-viewport');

        return handleShown(warnings);
      });
    // }
    // console.log("diagramXML2", diagramXML)

    if (diagramXML) {
      // console.log("diagramXML", diagramXML)
      return displayDiagram(newBpmnViewer, diagramXML);
    }

    if (props.url && !diagramXML) {
      // console.log("diagramXML4", diagramXML)
      return fetchDiagram(props.url);
    }
    // console.log("diagramXML3", diagramXML)

    // return a function to execute at unmount
    return () => {
      bpmnViewer.destroy();
    }
  }, [props, diagramXML]);

  // useEffect(() => {
  //   // if (props.url !== prevProps.url) {
  //   // return this.fetchDiagram(props.url);
  //   // }
  //
  //   const currentXML = props.diagramXML || diagramXML;
  //
  //   // const previousXML = prevProps.diagramXML || prevState.diagramXML;
  //
  //   // if (currentXML && currentXML !== previousXML) {
  //   if (currentXML) {
  //     return displayDiagram(currentXML);
  //   }
  // }, [diagramXML]);

  function displayDiagram(bpmnViewerToUse, diagramXMLToDisplay) {
    bpmnViewerToUse.importXML(diagramXMLToDisplay);
  }

  function fetchDiagram(url) {

    handleLoading();
    // console.log("WHY!!!!")

    fetch(url)
      .then(response => response.text())
      .then(text => setDiagramXML(text))
      .catch(err => handleError(err));


    // console.log("diagramXML5", diagramXML)
  }

  function handleLoading() {
    const { onLoading } = props;

    if (onLoading) {
      onLoading();
    }
  }

  function handleError(err) {
    const { onError } = props;

    if (onError) {
      onError(err);
    }
  }

  function handleShown(warnings) {
    const { onShown } = props;

    if (onShown) {
      onShown(warnings);
    }
  }

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
