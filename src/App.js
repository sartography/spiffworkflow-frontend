import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import ReactEditor from "./react_editor"

function App() {
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
