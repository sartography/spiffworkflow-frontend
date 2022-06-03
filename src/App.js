import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import ReactBpmnEditor from "./react_bpmn_editor"

function App() {
  function onError(err) {
    console.log('ERROR:', err);
  }

  return (
    <ReactBpmnEditor
    url={process.env.PUBLIC_URL + '/sample.bpmn'}
    onError={ onError }
    />
  );
}

export default App;
