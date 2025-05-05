import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-tv-bg-secondary border-t border-gray-200 dark:border-tv-border py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Advanced Trading System (ATS) - All rights reserved
          </p>
        </div>
        
        <div className="flex space-x-4">
          <Link 
            to="/terms" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-ats-primary dark:hover:text-ats-primary"
          >
            Terms of Service
          </Link>
          <Link 
            to="/privacy" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-ats-primary dark:hover:text-ats-primary"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/disclaimer" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-ats-primary dark:hover:text-ats-primary"
          >
            Disclaimer
          </Link>
          <Link 
            to="/contact" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-ats-primary dark:hover:text-ats-primary"
          >
            Contact
          </Link>
        </div>
        
        <div className="mt-4 md:mt-0 text-xs text-gray-500 dark:text-gray-500">
          <p>
            Data provided for educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;