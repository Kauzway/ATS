import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPieChart, 
  FiTrendingUp, 
  FiBarChart2, 
  FiFilter, 
  FiSettings,
  FiX,
  FiMenu
} from 'react-icons/fi';
import ATSLogo from '../common/ATSLogo'; // Import the new logo component

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Close sidebar on small screens when navigating
  useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    }
  }, [location.pathname, isSmallScreen, setOpen]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome /> },
    { path: '/sectors', label: 'Sector Analysis', icon: <FiPieChart /> },
    { path: '/fno', label: 'F&O Trading', icon: <FiTrendingUp /> },
    { path: '/screener', label: 'Stock Screener', icon: <FiFilter /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings /> }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSmallScreen && open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Mobile menu button */}
      {isSmallScreen && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-20 p-2 rounded-md lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ats-primary"
        >
          <span className="sr-only">Open sidebar</span>
          <FiMenu className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0 bg-white dark:bg-tv-bg-secondary border-r border-gray-200 dark:border-tv-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-tv-border">
            <Link to="/" className="flex items-center">
              <ATSLogo height={32} />
            </Link>
            
            {isSmallScreen && (
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ats-primary"
              >
                <span className="sr-only">Close sidebar</span>
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto bg-white dark:bg-tv-bg-secondary">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'text-white bg-ats-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-tv-border'
                    }`}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-tv-border">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>ATS v0.1.0</p>
              <p className="mt-1">© 2025 Advanced Trading System</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;