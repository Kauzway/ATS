import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Store
import { RootState } from '../store';
import { toggleTheme } from '../store/slices/themeSlice';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Update document class when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [darkMode]);
  
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-tv-bg-primary">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        {/* Main content */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <Header 
            toggleSidebar={toggleSidebar} 
            darkMode={darkMode} 
            toggleTheme={handleToggleTheme} 
          />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;