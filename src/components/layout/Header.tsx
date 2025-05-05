import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiMenu, 
  FiMoon, 
  FiSun, 
  FiBell, 
  FiSearch, 
  FiUser,
  FiChevronDown
} from 'react-icons/fi';
import ATSLogo from '../common/ATSLogo'; // Import the logo component

import { RootState } from '../../store';

interface HeaderProps {
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const Header = ({ toggleSidebar, darkMode, toggleTheme }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const { marketData } = useSelector((state: RootState) => state.market);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log('Searching for:', searchQuery);
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'RSI Divergence Alert',
      message: 'INFY showing bullish RSI divergence on daily chart',
      time: '10 min ago',
      read: false
    },
    {
      id: 2,
      title: 'ADX Trend Alert',
      message: 'HDFCBANK entered strong trend (ADX > 25)',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Market Update',
      message: 'Nifty 50 closed 1.2% higher today',
      time: '3 hours ago',
      read: true
    }
  ];

  // Determine market status - open or closed
  const isMarketOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay();
    
    // Market is closed on weekends (0 = Sunday, 6 = Saturday)
    if (day === 0 || day === 6) {
      return false;
    }
    
    // Market hours: 9:15 AM to 3:30 PM
    if (hours > 9 || (hours === 9 && minutes >= 15)) {
      if (hours < 15 || (hours === 15 && minutes <= 30)) {
        return true;
      }
    }
    
    return false;
  };

  return (
    <header className="bg-white dark:bg-tv-bg-secondary border-b border-gray-200 dark:border-tv-border sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 py-2 lg:px-6">
        {/* Left section - Menu button (visible on larger screens) and Market status */}
        <div className="flex items-center space-x-4">
          <button
            className="hidden lg:block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <FiMenu className="h-6 w-6" />
          </button>
          
          {/* Logo visible on mobile screens */}
          <div className="lg:hidden">
            <Link to="/">
              <ATSLogo height={28} />
            </Link>
          </div>
          
          {/* Market status indicator */}
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isMarketOpen() ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isMarketOpen() ? 'Market Open' : 'Market Closed'}
            </span>
          </div>
          
          {/* Current index value */}
          {marketData && (
            <div className="hidden md:flex items-center space-x-3 ml-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {marketData.index}:
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {marketData.close.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-medium ${marketData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {marketData.change >= 0 ? '+' : ''}
                {marketData.change.toLocaleString('en-IN', { minimumFractionDigits: 2 })} 
                ({marketData.changePercent >= 0 ? '+' : ''}
                {marketData.changePercent.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>

        {/* Center section - Search */}
        <div className="hidden md:block flex-1 max-w-lg mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search stocks, indices..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-tv-border border border-transparent focus:border-ats-primary focus:bg-white dark:focus:bg-tv-bg-primary text-gray-900 dark:text-white text-sm transition-colors duration-200 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
              <FiSearch className="h-4 w-4" />
            </div>
          </form>
        </div>

        {/* Right section - Theme toggle, notifications, user menu */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <FiBell className="h-5 w-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-tv-bg-secondary rounded-md shadow-lg border border-gray-200 dark:border-tv-border overflow-hidden z-20">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-tv-border">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    <div>
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-200 dark:border-tv-border last:border-0 hover:bg-gray-50 dark:hover:bg-tv-border ${
                            notification.read ? 'opacity-70' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-200 dark:border-tv-border text-center">
                  <Link to="/notifications" className="text-xs text-ats-primary hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-tv-border flex items-center justify-center">
                  <FiUser className="h-5 w-5" />
                </div>
                <span className="hidden md:block text-sm font-medium">User</span>
                <FiChevronDown className="h-4 w-4" />
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-tv-bg-secondary rounded-md shadow-lg border border-gray-200 dark:border-tv-border overflow-hidden z-20">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-tv-border">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
                </div>
                <div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-tv-border"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-tv-border"
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-tv-border"
                    onClick={() => {
                      // Implement logout
                      console.log('Logout');
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile search - visible only on small screens */}
      <div className="md:hidden px-4 pb-2">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search stocks, indices..."
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-tv-border border border-transparent focus:border-ats-primary focus:bg-white dark:focus:bg-tv-bg-primary text-gray-900 dark:text-white text-sm transition-colors duration-200 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
            <FiSearch className="h-4 w-4" />
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;