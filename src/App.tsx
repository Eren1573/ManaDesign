import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConvexProvider } from './lib/convex-client';
import { RequireAuth } from './components/RequireAuth';

import { useDarkMode } from './hooks/use-dark-mode';

// Lazy-loaded pages for optimal chunking
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Studio = lazy(() => import('./pages/Studio').then((m) => ({ default: m.Studio })));
const Store = lazy(() => import('./pages/Store').then((m) => ({ default: m.Store })));
const TemplateDetail = lazy(() => import('./pages/TemplateDetail').then((m) => ({ default: m.TemplateDetail })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Auth = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Auth })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const ToolsPreview = lazy(() => import('./pages/ToolsPreview').then((m) => ({ default: m.ToolsPreview })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-3 border-sky-500 border-t-transparent animate-spin" />
  </div>
);

export const App: React.FC = () => {
  useDarkMode();

  return (
    <ConvexProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="/studio" element={<Studio />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/:slug" element={<TemplateDetail />} />
          <Route path="/tools" element={<ToolsPreview />} />
          <Route path="/tools/:toolId" element={<ToolsPreview />} />
          <Route path="/video-studio" element={<ToolsPreview />} />
          <Route path="/avatar-studio" element={<ToolsPreview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ConvexProvider>
  );
};

