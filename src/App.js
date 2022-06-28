import React, { useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorContext from './contexts/ErrorContext';
import NavigationBar from './components/NavigationBar';

import ProcessGroups from './routes/ProcessGroups';
import ProcessGroupShow from './routes/ProcessGroupShow';
import ProcessGroupNew from './routes/ProcessGroupNew';
import ProcessGroupEdit from './routes/ProcessGroupEdit';
import ProcessModelShow from './routes/ProcessModelShow';
import ProcessModelEditDiagram from './routes/ProcessModelEditDiagram';
import ProcessInstanceList from './routes/ProcessInstanceList';
import ProcessInstanceReport from './routes/ProcessInstanceReport';
import ProcessModelNew from './routes/ProcessModelNew';
import ProcessModelEdit from './routes/ProcessModelEdit';
import ProcessInstanceShow from './routes/ProcessInstanceShow';
import TaskList from './routes/TaskList';
import TaskShow from './routes/TaskShow';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [errorMessage, setErrorMessage] = useState('');

  const errorContextValueArray = useMemo(
    () => [errorMessage, setErrorMessage],
    [errorMessage]
  );

  let errorTag = '';
  if (errorMessage !== '') {
    errorTag = (
      <div id="filter-errors" className="mt-4 alert alert-danger" role="alert">
        {errorMessage}
      </div>
    );
  }

  return (
    <ErrorContext.Provider value={errorContextValueArray}>
      <NavigationBar />
      <Container>
        {errorTag}
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ProcessGroups />} />

              <Route path="process-groups" element={<ProcessGroups />} />
              <Route
                path="process-groups/:process_group_id"
                element={<ProcessGroupShow />}
              />
              <Route path="process-groups/new" element={<ProcessGroupNew />} />
              <Route
                path="process-groups/:process_group_id/edit"
                element={<ProcessGroupEdit />}
              />

              <Route
                path="process-models/:process_group_id/new"
                element={<ProcessModelNew />}
              />
              <Route
                path="process-models/:process_group_id/:process_model_id"
                element={<ProcessModelShow />}
              />
              <Route
                path="process-models/:process_group_id/:process_model_id/file"
                element={<ProcessModelEditDiagram />}
              />
              <Route
                path="process-models/:process_group_id/:process_model_id/file/:file_name"
                element={<ProcessModelEditDiagram />}
              />
              <Route
                path="process-models/:process_group_id/:process_model_id/process-instances"
                element={<ProcessInstanceList />}
              />
              <Route
                path="process-models/:process_group_id/:process_model_id/process-instances/report"
                element={<ProcessInstanceReport />}
              />
              <Route
                path="process-models/:process_group_id/:process_model_id/edit"
                element={<ProcessModelEdit />}
              />
              <Route
                path="process-models/:process_group_id/:process_model_id/process-instances/:process_instance_id"
                element={<ProcessInstanceShow />}
              />
              <Route path="tasks" element={<TaskList />} />
              <Route path="tasks/:task_id" element={<TaskShow />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </Container>
    </ErrorContext.Provider>
  );
}
