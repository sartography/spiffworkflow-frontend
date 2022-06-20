import React from 'react';
// import ReactDOM from 'react-dom/client';
import * as ReactDOMClient from 'react-dom/client';


import 'bootstrap/dist/css/bootstrap.css';
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
import ProcessGroupEdit from "./routes/ProcessGroupEdit"
import ProcessModelShow from "./routes/ProcessModelShow"
import ProcessModelEditDiagram from "./routes/ProcessModelEditDiagram"
import ProcessInstanceList from "./routes/ProcessInstanceList"
import ProcessInstanceReport from "./routes/ProcessInstanceReport"
import ProcessModelNew from "./routes/ProcessModelNew"
import ProcessModelEdit from "./routes/ProcessModelEdit"
import ProcessInstanceShow from "./routes/ProcessInstanceShow"
import ErrorBoundary from "./components/ErrorBoundary"

import { Container } from 'react-bootstrap'


const root = ReactDOMClient.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Container>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProcessGroups />} />

            <Route path="process-groups" element={<ProcessGroups />} />
            <Route path="process-groups/:process_group_id" element={<ProcessGroupShow />} />
            <Route path="process-groups/new" element={<ProcessGroupNew />} />
            <Route path="process-groups/:process_group_id/edit" element={<ProcessGroupEdit />} />

            <Route path="process-models/:process_group_id/new" element={<ProcessModelNew />} />
            <Route path="process-models/:process_group_id/:process_model_id" element={<ProcessModelShow />} />
            <Route path="process-models/:process_group_id/:process_model_id/file" element={<ProcessModelEditDiagram />} />
            <Route path="process-models/:process_group_id/:process_model_id/file/:file_name" element={<ProcessModelEditDiagram />} />
            <Route path="process-models/:process_group_id/:process_model_id/process-instances" element={<ProcessInstanceList />} />
            <Route path="process-models/:process_group_id/:process_model_id/process-instances/report" element={<ProcessInstanceReport />} />
            <Route path="process-models/:process_group_id/:process_model_id/edit" element={<ProcessModelEdit />} />
            <Route path="process-models/:process_group_id/:process_model_id/process-instances/:process_instance_id" element={<ProcessInstanceShow />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </Container>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
