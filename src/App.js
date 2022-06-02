// import logo from './logo.svg';
// import './App.css';
// import BpmnModeler from 'bpmn-js';
// import {
//   BpmnPropertiesPanelModule,
//   BpmnPropertiesProviderModule,
// } from 'bpmn-js-properties-panel';
//
// import React, { useEffect, useState } from "react";
// import Modeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
// import axios from "axios";
import ReactEditor from "./react_editor"

function App() {
  //   return (
  //     <div className="App">
  //       <header className="App-header">
  //         <img src={logo} className="App-logo" alt="logo" />
  //         <p>
  //           Edit <code>src/App.js</code> and save to reload.
  //         </p>
  //         <a
  //           className="App-link"
  //           href="https://reactjs.org"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Learn React
  //         </a>
  //       </header>
  //     </div>
  //   );

  // from spiff backend
  // const bpmnModeler = new BpmnModeler({
  //   container: '#canvas',
  //   propertiesPanel: {
  //     parent: '#properties'
  //   },
  //   additionalModules: [
  //     BpmnPropertiesPanelModule,
  //     BpmnPropertiesProviderModule
  //   ]
  // });
  //
  // async function exportDiagram() {
  //   try {
  //     var data = await bpmnModeler.saveXML({ format: true });
  //     //POST request with body equal on data in JSON format
  //     fetch("/admin/process-models/{{ process_model.id }}/save/{{ file_name }}", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "text/xml",
  //       },
  //       body: data.xml,
  //     })
  //       .then((response) => response.json())
  //     //Then with the data from the response in JSON...
  //       .then((data) => {
  //         console.log("Success:", data);
  //       })
  //     //Then with the error genereted...
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //
  //     alert("Diagram exported. Check the developer tools!");
  //   } catch (err) {
  //     console.error("could not save BPMN 2.0 diagram", err);
  //   }
  // }
  //
  // #<{(|*
  //  * Open diagram in our modeler instance.
  //  *
  //  * @param {String} bpmnXML diagram to display
  //  |)}>#
  // async function openDiagram(bpmnXML) {
  //   // import diagram
  //   try {
  //     await bpmnModeler.importXML(bpmnXML);
  //
  //     // access modeler components
  //     var canvas = bpmnModeler.get("canvas");
  //     var overlays = bpmnModeler.get("overlays");
  //
  //     // zoom to fit full viewport
  //     canvas.zoom("fit-viewport");
  //
  //     // attach an overlay to a node
  //     overlays.add("SCAN_OK", "note", {
  //       position: {
  //         bottom: 0,
  //         right: 0,
  //       },
  //       html: '<div class="diagram-note">Mixed up the labels?</div>',
  //     });
  //
  //     // add marker
  //     canvas.addMarker("SCAN_OK", "needs-discussion");
  //   } catch (err) {
  //     console.error("could not import BPMN 2.0 diagram", err);
  //   }
  // }
  //
  // // trying to use the python variable bpmn_xml directly causes the xml to have escape sequences
  // // and using the meta tag seems to help with that
  // // var bpmn_xml = $("#bpmn_xml").data();
  // openDiagram({process.env.PUBLIC_URL + '/sample.bpmn'});
  //
  // // wire save button
  // $("#save-button").click(exportDiagram);


  // const [diagram, diagramSet] = useState("");
  // const container = document.getElementById("container");
  //
  // useEffect(() => {
  //   if (diagram.length === 0) {
  //     axios
  //       .get(
  //         "https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/master/colors/resources/pizza-collaboration.bpmn"
  //       )
  //       .then((r) => {
  //         diagramSet(r.data);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   }
  // }, [diagram]);
  //
  // if (diagram.length > 0) {
  //   const modeler = new Modeler({
  //     container,
  //     keyboard: {
  //       bindTo: document
  //     }
  //   });
  //   modeler
  //     .importXML(diagram)
  //     .then(({ warnings }) => {
  //       if (warnings.length) {
  //         console.log("Warnings", warnings);
  //       }
  //
  //       const canvas = modeler.get("modeling");
  //       canvas.setColor("CalmCustomerTask", {
  //         stroke: "green",
  //         fill: "yellow"
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("error", err);
  //     });
  // }
  //
  // return (
  //   <div className="App">
  //     <div
  //       id="container"
  //       style={{
  //         border: "1px solid #000000",
  //         height: "90vh",
  //         width: "90vw",
  //         margin: "auto"
  //       }}
  //     ></div>
  //   </div>
  // );


  function onError(err) {
    console.log('ERROR:', err);
  }

  return (
    <ReactEditor
      url={process.env.PUBLIC_URL + '/sample.bpmn'}
      onError={ onError }
    />
  );
}

export default App;
