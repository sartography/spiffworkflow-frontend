import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
// import ReactBpmnEditor from "./react_bpmn_editor"
import { Link } from "react-router-dom";
import ProcessGroups from "./routes/ProcessGroups"


function App() {
  function onError(err) {
    console.log('ERROR:', err);
  }

    // <ReactBpmnEditor
    // url={process.env.PUBLIC_URL + '/sample.bpmn'}
    // onError={ onError }
    // />
    // <Link to="/expenses">Expenses</Link>
  return (
    <div>
    <Link to="/process-groups">Process Groups</Link>
    </div>
  );
}

export default App;
