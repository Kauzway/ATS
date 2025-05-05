import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from './layouts/MainLayout';

// Components
import Spinner from './components/common/Spinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Hooks
import { useAppDispatch } from './hooks/redux';
import { RootState } from './store';
import { initializeApp } from './store/slices/appSlice';

// Lazy load pages for better performance and code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StockAnalysis = lazy(() => import('./pages/StockAnalysis'));
const SectorAnalysis = lazy(() => import('./pages/SectorAnalysis'));
const FnoTrading = lazy(() => import('./pages/FnoTrading'));
const Screener = lazy(() => import('./pages/Screener'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Page loader component
const PageLoader = () => (
  <div className="h-full flex items-center justify-center p-8">
    <Spinner size="lg" label="Loading page..." />
  </div>
);

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { initialized } = useSelector((state: RootState) => state.app);
  const [appReady, setAppReady] = useState(false);
  
  // Initialize app data
  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);
  
  // Set app as ready once initialized
  useEffect(() => {
    if (initialized) {
      setAppReady(true);
    }
  }, [initialized]);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  if (!appReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-tv-bg-primary">
        <div className="text-center">
          <div className="animate-spin-slow inline-block w-12 h-12 border-4 border-t-ats-primary border-l-ats-primary border-r-gray-300 border-b-gray-300 dark:border-b-tv-border dark:border-r-tv-border rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-tv-text-secondary">Loading ATS...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={<MainLayout />}
        >
          <Route
            index
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="stock/:symbol"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <StockAnalysis />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="sectors"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <SectorAnalysis />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="fno"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FnoTrading />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="screener"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Screener />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="settings"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Settings />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="*"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <NotFound />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App;