import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

// Import environment variable validation
import validateEnv, { getFormattedEnvVars, isDevelopment } from './utils/validateEnv';
import ErrorBoundary from './components/common/ErrorBoundary';

// Global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  // You could send this to an error tracking service
});

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You could send this to an error tracking service
});

// Initialize the application
const initializeApp = () => {
  try {
    // Validate environment variables
    validateEnv();
    
    // Log environment variables in development
    if (isDevelopment()) {
      console.log('Environment Variables:', getFormattedEnvVars());
    }
    
    // Render the application
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <ErrorBoundary>
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    // Handle initialization errors
    console.error('Failed to initialize application:', error);
    
    // Render a fallback UI for critical initialization errors
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Application Initialization Failed
          </h1>
          <p className="text-gray-600 mb-4">
            There was an error initializing the application. Please check the configuration and try again.
          </p>
          {isDevelopment() && error instanceof Error && (
            <div className="mb-4 p-3 bg-red-50 rounded-md text-left">
              <h2 className="text-sm font-semibold text-red-800 mb-1">
                Error Details:
              </h2>
              <p className="text-xs text-red-800 font-mono whitespace-pre-wrap">
                {error.message}
              </p>
              {error.stack && (
                <p className="text-xs text-red-800 font-mono overflow-auto max-h-32 whitespace-pre-wrap mt-2">
                  {error.stack}
                </p>
              )}
            </div>
          )}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
};

// Start the application
initializeApp();