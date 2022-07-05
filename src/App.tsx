import React, { useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorContext from './contexts/ErrorContext';
import NavigationBar from './components/NavigationBar';

import TaskList from './routes/TaskList';
import TaskShow from './routes/TaskShow';
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
    // @ts-expect-error TS(2322): Type 'Element' is not assignable to type 'string'.
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
              <Route path="/" element={<AdminRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              {/* @ts-expect-error TS(2786): 'TaskList' cannot be used as a JSX component. */}
              <Route path="/tasks" element={<TaskList />} />
              {/* @ts-expect-error TS(2786): 'TaskShow' cannot be used as a JSX component. */}
              <Route path="/tasks/:task_id" element={<TaskShow />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </Container>
    </ErrorContext.Provider>
  );
}
