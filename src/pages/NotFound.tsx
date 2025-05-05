import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <FiAlertCircle className="h-16 w-16 text-ats-primary mb-6" />
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Page Not Found
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/">
        <Button variant="primary" leftIcon={<FiArrowLeft />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;