// @ts-ignore
import { Content } from '@carbon/react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { defineAbility } from '@casl/ability';
import NavigationBar from './components/NavigationBar';

import HomePageRoutes from './routes/HomePageRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoutes from './routes/AdminRoutes';

import { AbilityContext } from './contexts/Can';
import UserService from './services/UserService';
import ErrorDisplay from './components/ErrorDisplay';
import APIErrorProvider from './contexts/APIErrorContext';

export default function App() {
  if (!UserService.isLoggedIn()) {
    UserService.doLogin();
    return null;
  }

  const ability = defineAbility(() => {});

  return (
    <div className="cds--white">
      {/* @ts-ignore */}
      <AbilityContext.Provider value={ability}>
        <APIErrorProvider>
          <BrowserRouter>
            <NavigationBar />
            <Content>
              <ErrorDisplay />
              <ErrorBoundary>
                <Routes>
                  <Route path="/*" element={<HomePageRoutes />} />
                  <Route path="/tasks/*" element={<HomePageRoutes />} />
                  <Route path="/admin/*" element={<AdminRoutes />} />
                </Routes>
              </ErrorBoundary>
            </Content>
          </BrowserRouter>
        </APIErrorProvider>
      </AbilityContext.Provider>
    </div>
  );
}
