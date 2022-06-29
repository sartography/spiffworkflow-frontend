import React, { useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorContext from './contexts/ErrorContext';
import NavigationBar from './components/NavigationBar';

// import ProcessGroups from './routes/ProcessGroups';
// import ProcessGroupShow from './routes/ProcessGroupShow';
// import ProcessGroupNew from './routes/ProcessGroupNew';
// import ProcessGroupEdit from './routes/ProcessGroupEdit';
// import ProcessModelShow from './routes/ProcessModelShow';
// import ProcessModelEditDiagram from './routes/ProcessModelEditDiagram';
// import ProcessInstanceList from './routes/ProcessInstanceList';
// import ProcessInstanceReport from './routes/ProcessInstanceReport';
// import ProcessModelNew from './routes/ProcessModelNew';
// import ProcessModelEdit from './routes/ProcessModelEdit';
// import ProcessInstanceShow from './routes/ProcessInstanceShow';
// import TaskList from './routes/TaskList';
// import TaskShow from './routes/TaskShow';
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoutes from './routes/AdminRoutes';

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
  // <BrowserRouter basename="tasks">
  //   <Routes>
  //     <Route path="/" element={<TaskList />} />
  //     <Route path="/:task_id" element={<TaskShow />} />
  //   </Routes>
  // </BrowserRouter>

  return (
    <ErrorContext.Provider value={errorContextValueArray}>
      <NavigationBar />
      <Container>
        {errorTag}
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </Container>
    </ErrorContext.Provider>
  );
}
