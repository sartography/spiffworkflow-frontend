// import logo from './logo.svg';
import './App.css';
import BpmnModeler from 'bpmn-js';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

function App(props) {
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
  function onShown() {
    console.log('diagram shown');
  }

  function onLoading() {
    console.log('diagram loading');
  }

  function onError(err) {
    console.log('failed to show diagram');
  }

  // return (
  //   <ReactBpmn
  //     url={process.env.PUBLIC_URL + '/sample.bpmn'}
  //     onShown={ onShown }
  //     onLoading={ onLoading }
  //     onError={ onError }
  //   />
  // );
  //

  const bpmnModeler = new BpmnModeler({
    container: '#canvas',
    propertiesPanel: {
      parent: '#properties'
    },
    additionalModules: [
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule
    ]
  });

  async function exportDiagram() {
    try {
      var data = await bpmnModeler.saveXML({ format: true });
      //POST request with body equal on data in JSON format
      fetch("/admin/process-models/{{ process_model.id }}/save/{{ file_name }}", {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
        },
        body: data.xml,
      })
        .then((response) => response.json())
      //Then with the data from the response in JSON...
        .then((data) => {
          console.log("Success:", data);
        })
      //Then with the error genereted...
        .catch((error) => {
          console.error("Error:", error);
        });

      alert("Diagram exported. Check the developer tools!");
    } catch (err) {
      console.error("could not save BPMN 2.0 diagram", err);
    }
  }

  /**
   * Open diagram in our modeler instance.
   *
   * @param {String} bpmnXML diagram to display
   */
  async function openDiagram(bpmnXML) {
    // import diagram
    try {
      await bpmnModeler.importXML(bpmnXML);

      // access modeler components
      var canvas = bpmnModeler.get("canvas");
      var overlays = bpmnModeler.get("overlays");

      // zoom to fit full viewport
      canvas.zoom("fit-viewport");

      // attach an overlay to a node
      overlays.add("SCAN_OK", "note", {
        position: {
          bottom: 0,
          right: 0,
        },
        html: '<div class="diagram-note">Mixed up the labels?</div>',
      });

      // add marker
      canvas.addMarker("SCAN_OK", "needs-discussion");
    } catch (err) {
      console.error("could not import BPMN 2.0 diagram", err);
    }
  }

  // trying to use the python variable bpmn_xml directly causes the xml to have escape sequences
  // and using the meta tag seems to help with that
  // var bpmn_xml = $("#bpmn_xml").data();
  openDiagram({process.env.PUBLIC_URL + '/sample.bpmn'});

  // wire save button
  $("#save-button").click(exportDiagram);

}

export default App;
