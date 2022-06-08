import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProcessGroups from "./routes/ProcessGroups"
import ProcessGroupShow from "./routes/ProcessGroupShow"
import ProcessGroupNew from "./routes/ProcessGroupNew"
import ProcessModelShow from "./routes/ProcessModelShow"
import ProcessModelEditDiagram from "./routes/ProcessModelEditDiagram"
import ProcessInstanceList from "./routes/ProcessInstanceList"

import { Container } from 'react-bootstrap'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Container>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProcessGroups />} />

        <Route path="process-groups" element={<ProcessGroups />} />
        <Route path="process-groups/:process_group_id" element={<ProcessGroupShow />} />
        <Route path="process-groups/new" element={<ProcessGroupNew />} />

        <Route path="process-models/:process_model_id" element={<ProcessModelShow />} />
        <Route path="process-models/:process_model_id/file/:file_name" element={<ProcessModelEditDiagram />} />
        <Route path="process-models/:process_model_id/process-instances" element={<ProcessInstanceList />} />
      </Routes>
    </BrowserRouter>
    </Container>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
