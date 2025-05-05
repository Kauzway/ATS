import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import StockAnalysis from './pages/StockAnalysis';
import SectorAnalysis from './pages/SectorAnalysis';
import FnoTrading from './pages/FnoTrading';
import Screener from './pages/Screener';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Hooks
import { useAppDispatch } from './hooks/redux';
import { RootState } from './store';
import { initializeApp } from './store/slices/appSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const { initialized } = useSelector((state: RootState) => state.app);
  const [appReady, setAppReady] = useState(false);
  
  useEffect(() => {
    // Initialize app data
    dispatch(initializeApp());
  }, [dispatch]);
  
  useEffect(() => {
    if (initialized) {
      // Once app is initialized, set app as ready
      setAppReady(true);
    }
  }, [initialized]);
  
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
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="stock/:symbol" element={<StockAnalysis />} />
        <Route path="sectors" element={<SectorAnalysis />} />
        <Route path="fno" element={<FnoTrading />} />
        <Route path="screener" element={<Screener />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;